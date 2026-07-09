# Arquitetura — BanheiroUTFPR

## Visão geral

```
┌─────────────────┐        HTTP/JSON         ┌──────────────────┐        JDBC        ┌─────────┐
│    Frontend     │  ───────────────────▶    │    Backend       │  ──────────────▶   │  MySQL  │
│   Angular 18    │   Authorization: Bearer  │  Spring Boot 2.7 │   Flyway migra o   │    8    │
│ localhost:4200  │  ◀───────────────────    │  localhost:8080  │   schema no boot   │  :3306  │
└─────────────────┘                          └──────────────────┘                    └─────────┘
```

## Backend (Spring Boot)

Organização por camadas, pacote raiz `br.edu.utfpr.tds.api`:

| Pacote | Responsabilidade |
|--------|------------------|
| `model` | Entidades JPA: `Usuario`, `Campus`, `Localizacao`, `Banheiro`, `Avaliacao`, `Comentario`, `Insight` |
| `repository` | Interfaces Spring Data JPA (+ `specs`/`filter` para pesquisa dinâmica de avaliações) |
| `service` | Regras de negócio: `AvaliacaoService` (1 avaliação/dia, banheiro inativo, recálculo da média), `InsightService` (módulo de inteligência), `UsuarioService` (cadastro seguro) |
| `resource` | Controllers REST (um por recurso) |
| `security` | JWT: geração/validação (`JwtService`), filtro (`JwtAuthenticationFilter`), `UserDetailsService` |
| `config` | `SecurityConfig` (JWT, padrão), `BasicSecurityConfig` (profile `basic-security`), `DataLoader` |
| `exceptionhandler` | Tratamento centralizado de erros (`@RestControllerAdvice`) com corpo padronizado `Problema` |
| `event` | Evento `RecursoCriadoEvent` → listener adiciona o header `Location` nos POSTs |
| `dto` | Objetos de resposta do módulo de inteligência (`FaixaHorariaStats`, `CampusPanorama`) |

### Fluxo de uma avaliação (POST /avaliacoes)

1. `JwtAuthenticationFilter` valida o Bearer token e autentica o usuário no contexto.
2. `AvaliacaoResource.criar` recebe o JSON validado (Bean Validation: notas de 1 a 5).
3. `AvaliacaoService.salvar`:
   - carrega o usuário pelo e-mail do token (o cliente **não** informa o usuário);
   - verifica se o banheiro existe e está ativo (senão **422**);
   - verifica a regra de **1 avaliação por usuário/banheiro/dia** (senão **422**) —
     também garantida por constraint UNIQUE no banco;
   - registra data e horário automaticamente (base da análise temporal);
   - salva e recalcula `notaMedia`/`totalAvaliacoes` do banheiro.
4. O evento `RecursoCriadoEvent` preenche o header `Location` e a API responde **201**.

### Módulo de inteligência

`InsightService` recalcula os insights de todos os banheiros ativos:

- **Job agendado**: `@Scheduled(cron = "${banheiros.insights.cron}")` — de hora em hora;
- **Sob demanda**: `POST /insights/gerar` (ADMIN), útil na demonstração.

Análises: melhor horário (maior índice silêncio+movimentação por faixa Manhã/Tarde/Noite),
horário de pico, tendência de qualidade (metade antiga × metade recente das avaliações) e
alertas/destaques pelos selos (Zona de Risco / Trono de Ouro). Os insights são persistidos
na tabela `insight` com os dados de apoio em JSON.

## Banco de dados (Flyway)

Migrations em `backend/src/main/resources/db/migration`:

- `V1__criacao_tabelas.sql` — todas as tabelas, FKs e a UNIQUE de 1 avaliação/dia;
- `V2__dados_iniciais.sql` — usuários iniciais (senha com BCrypt), câmpus, localizações,
  banheiros e avaliações de demonstração (datas relativas a `CURDATE()`).

O Hibernate roda com `ddl-auto=validate`: quem manda no schema é o Flyway.

```
campus 1──N localizacao 1──N banheiro 1──N avaliacao N──1 usuario
                                   │ 1──N comentario N──1 usuario
                                   └ 1──N insight
```

## Frontend (Angular 18)

| Pasta | Conteúdo |
|-------|----------|
| `core/` | `AuthService` (login/JWT/roles com signals), `authInterceptor` (Bearer + tratamento de 401), guards (`authGuard`, `adminGuard`), serviços HTTP (`CatalogoService`, `AvaliacaoService`, `InsightService`) e modelos TypeScript |
| `pages/` | `home` (lista + filtros + panorama), `banheiro-detalhe` (avaliação, comentários, insights, horários), `ranking`, `login`, `registro`, `perfil`, `admin` (CRUD + gerar insights) |
| `shared/` | `StarRatingComponent` (exibição e seleção de notas em estrelas) |

Rotas protegidas: `/perfil` (autenticado) e `/admin` (ADMIN) — os links também são
condicionais no menu conforme o estado de autenticação (signals do `AuthService`).

## Segurança

- Senhas com **BCrypt**; cadastro público força role `USER` (impede escalonamento de privilégio).
- **Access token** JWT de 30 min; **refresh token** de 7 dias em cookie **HttpOnly** com
  `SameSite=Strict` e path restrito a `/oauth/token`.
- CORS restrito às origens do frontend (`banheiros.cors.allowed-origins`).
- Autorização por rota/método no `SecurityConfig` (leituras públicas; escrita da estrutura
  só ADMIN; avaliar/comentar exige autenticação).
- Troca do mecanismo de segurança por *profile* (`basic-security` → HTTP Basic) sem alterar o restante do código.
