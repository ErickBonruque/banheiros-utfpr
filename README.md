# 🚻 BanheiroUTFPR

Sistema inteligente e colaborativo de **avaliação de banheiros do campus** da UTFPR.
Projeto final da disciplina de Análise e Desenvolvimento de Software — UTFPR Câmpus Santa Helena.

**Aluno:** Erick Bonruque · **RA:** 2587246 · **Ano:** 2026

## Descrição do sistema

O BanheiroUTFPR permite que alunos avaliem e consultem a qualidade dos banheiros dos câmpus da UTFPR.
Usuários cadastrados atribuem notas em **7 critérios** (limpeza, cheiro, papel higiênico, estado das
portas, iluminação, silêncio e movimentação), deixam comentários, acompanham o **ranking** e consultam
**insights inteligentes** gerados a partir dos dados coletados.

Principais funcionalidades:

- Cadastro e autenticação de usuários com **JWT** (login, registro, refresh token e logout)
- Hierarquia flexível **Câmpus → Localização → Banheiro** (suporta prédios, blocos, áreas externas, containers etc.)
- Avaliação com 7 critérios (1 a 5 estrelas) com data e horário registrados automaticamente
- Regra de negócio: **cada usuário avalia o mesmo banheiro no máximo 1 vez por dia** (HTTP 422)
- Regra de negócio: banheiro **inativo não pode ser avaliado** (HTTP 422)
- Nota média do banheiro recalculada automaticamente a cada avaliação
- Selos automáticos: **🏆 Trono de Ouro** (média ≥ 4.5) e **⚠️ Zona de Risco** (média < 2.0)
- Comentários por banheiro (fórum de dicas)
- Ranking geral dos banheiros e filtros por câmpus, localização, tipo e acessibilidade
- **Módulo de inteligência** (job agendado via Spring `@Scheduled` + geração manual pelo admin):
  - Melhor horário para uso (análise de silêncio/movimentação por faixa de horário)
  - Horário de pico de movimento
  - Tendência de qualidade (melhorando / piorando / estável)
  - Alertas e destaques automáticos (Zona de Risco / Trono de Ouro)
  - Panorama geral do câmpus (totais, média geral, melhor e pior banheiro)
- Painel administrativo (CRUD de câmpus, localizações e banheiros) restrito ao perfil ADMIN
- Perfil do usuário com histórico de avaliações e troca de senha

## Tecnologias utilizadas

**Backend (`backend/`)**
- Java 8+ · Spring Boot 2.7 (Web, Data JPA, Validation, Security)
- MySQL 8 · Hibernate (`ddl-auto=validate`)
- **Flyway** — versionamento do banco de dados (`backend/src/main/resources/db/migration`)
- JWT (jjwt) — autenticação stateless com access token + refresh token em cookie HttpOnly
- BCrypt — hash de senhas
- Spring `@Scheduled` — job agendado de geração de insights

**Frontend (`frontend/`)**
- Angular 18 (componentes standalone, rotas com guards, interceptor HTTP, serviços, signals)
- TypeScript · CSS puro

**Apoio**
- Docker Compose (MySQL) · Insomnia (coleção de testes em `api-tests/`)

## Estrutura do repositório

```
banheiros-utfpr/
├── backend/      API REST Spring Boot
│   └── src/main/resources/db/migration/   scripts Flyway (V1 schema, V2 dados)
├── frontend/     Aplicação Angular
├── api-tests/    Coleção Insomnia com todos os endpoints
├── docs/         Descritivo do projeto, arquitetura e roteiro dos vídeos
└── docker-compose.yml   MySQL 8 para desenvolvimento
```

## Como executar o projeto

Pré-requisitos: **Java 8+**, **Maven**, **Node 18+** e **Docker** (ou um MySQL 8 local).

### 1. Banco de dados (MySQL)

```bash
docker compose up -d
```

Sobe um MySQL 8 em `localhost:3306` com o banco `banheiro_utfpr` (usuário `root`, senha em branco).
Se preferir usar um MySQL próprio, ajuste `backend/src/main/resources/application.properties`.

> **Versionamento do banco:** na primeira execução da API o **Flyway** cria todas as tabelas (`V1`)
> e insere os dados iniciais (`V2`) automaticamente. Não é preciso rodar script manual.

### 2. Backend (API)

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

A aplicação sobe em `http://localhost:4200`.

## Usuários iniciais

Criados pela migration `V2__dados_iniciais.sql`:

| Perfil | E-mail | Senha |
|--------|--------|-------|
| ADMIN | `admin@utfpr.edu.br` | `admin123` |
| USER | `joao@alunos.utfpr.edu.br` | `user123` |
| USER | `maria@alunos.utfpr.edu.br` | `user123` |

## Autenticação

A API usa **JWT (Bearer Token)** com fluxo de senha simplificado (OAuth2 Password Flow):

- `POST /oauth/token` — login com `{"email": "...", "senha": "..."}`; retorna o **access token**
  (30 min) no corpo e grava o **refresh token** (7 dias) em cookie **HttpOnly**
- `POST /oauth/token/refresh` — renova o access token a partir do cookie
- `DELETE /oauth/token` — logout (remove o cookie)

Requisições autenticadas enviam o header `Authorization: Bearer <access_token>`.
Perfis de acesso: **ADMIN** (gestão da estrutura e de usuários) e **USER** (avaliar e comentar).
Leituras (GET) de câmpus, localizações, banheiros, avaliações, comentários e insights são públicas.

Alternativa didática: rodando com o profile `basic-security`, a API troca o JWT por **HTTP Basic**
(`mvn spring-boot:run -Dspring-boot.run.profiles=basic-security`).

## Testes dos endpoints

Importe `api-tests/Insomnia_BanheiroUTFPR.json` no Insomnia (Application → Import).
A coleção cobre **todos os endpoints**, organizados por domínio, incluindo os cenários de erro
(regra de 1 avaliação/dia, banheiro inativo, acesso negado).

Após o *Login (admin)*, copie o `accessToken` da resposta para a variável de ambiente
`access_token` da coleção — as demais requisições já usam Bearer automaticamente.

## Documentação

- [`docs/BanheiroUTFPR_Descritivo.md`](docs/BanheiroUTFPR_Descritivo.md) — descritivo do projeto (entidades, regras, rotas)
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — arquitetura das aplicações e do banco
- [`docs/ROTEIRO_VIDEOS.md`](docs/ROTEIRO_VIDEOS.md) — roteiro sugerido para os vídeos de apresentação
- [`docs/CHECKPOINTS.md`](docs/CHECKPOINTS.md) — histórico dos checkpoints da disciplina
