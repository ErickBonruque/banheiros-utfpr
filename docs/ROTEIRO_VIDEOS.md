# Roteiro dos vídeos de apresentação — BanheiroUTFPR

Checklist do que mostrar em cada um dos 3 vídeos pedidos na entrega.
Antes de gravar, deixe rodando: `docker compose up -d`, backend (`mvn spring-boot:run`) e
frontend (`npm start`), e o Insomnia com a coleção importada e o token do admin já colado.

---

## Vídeo 1 — Arquitetura, configuração e implementação

1. **Visão geral do repositório** (raiz): `backend/`, `frontend/`, `api-tests/`, `docs/`,
   `docker-compose.yml`. Comente que o projeto tem API REST + SPA separadas.
2. **docker-compose.yml** — MySQL 8 em container, banco `banheiro_utfpr`.
3. **backend/pom.xml** — dependências: Web, Data JPA, Validation, Security, JWT (jjwt), **Flyway**, MySQL.
4. **application.properties** — datasource, `ddl-auto=validate` (schema é do Flyway),
   configurações de JWT (secret, expirações), CORS e cron dos insights.
5. **Flyway** — abra `db/migration/V1__criacao_tabelas.sql` (tabelas, FKs e a UNIQUE da regra
   de 1 avaliação/dia) e `V2__dados_iniciais.sql` (usuários com BCrypt e dados de demonstração).
   Mostre no console da primeira subida as linhas `Migrating schema ... to version "1"` / `"2"`,
   ou a tabela `flyway_schema_history` no banco.
6. **Camadas do backend** (use docs/ARQUITETURA.md como apoio):
   - `model/` — entidades (mostre `Avaliacao` com Bean Validation e `Banheiro` com o selo calculado);
   - `repository/` — Spring Data JPA + Specifications (`AvaliacaoSpecs`);
   - `service/` — `AvaliacaoService` (regras de negócio) e `InsightService` (job `@Scheduled`);
   - `resource/` — controllers REST;
   - `security/` — `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig` (permissões por rota/método).
7. **Frontend Angular** — estrutura `core/` (services, interceptor, guards) e `pages/`;
   mostre o `authInterceptor` anexando o Bearer token e o `app.routes.ts` com os guards.

## Vídeo 2 — Testes dos endpoints + debug

1. Abra o **Insomnia** com a coleção `api-tests/Insomnia_BanheiroUTFPR.json`.
2. **Autenticação**: login admin (mostre o access token e o cookie de refresh), refresh e logout.
   Cole o token na variável `access_token` do ambiente.
3. Percorra as pastas na ordem: usuários (cadastro público → role sempre USER), câmpus,
   localizações, banheiros (CRUD + PATCH ativo + ranking + filtros), avaliações, comentários,
   insights (gerar como admin e consultar), perfil.
4. **Cenários de erro** (importante mostrar):
   - criar avaliação 2× no mesmo dia → **422** com a mensagem da regra;
   - avaliar o banheiro 6 (inativo) → **422**;
   - POST /campus sem token ou com token de USER → **403**;
   - corpo com propriedade desconhecida ou nota fora de 1–5 → **400** com lista de erros.
5. **Debug**: coloque um breakpoint em `AvaliacaoService.salvar` (IntelliJ/VS Code),
   dispare o *Criar avaliação* pelo Insomnia e percorra passo a passo: carregamento do usuário
   pelo token → verificação do banheiro ativo → verificação da regra de 1/dia → save →
   recálculo da nota média. Mostre as variáveis no debugger.

## Vídeo 3 — Sistema rodando (todas as funcionalidades)

Roteiro sugerido no navegador (`http://localhost:4200`):

1. **Home sem login** — lista de banheiros com panorama do câmpus, filtros (câmpus,
   localização, tipo, acessível), selos 🏆/⚠️ nos cards.
2. **Detalhe de um banheiro** — notas, insights inteligentes, tabela de movimentação por
   horário, avaliações paginadas e comentários (tudo público para leitura).
3. **Criar conta** (registro) → login automático.
4. **Avaliar um banheiro** — 7 critérios em estrelas + comentário; mostre a nota média
   atualizando. Tente avaliar de novo → mensagem da regra de 1 avaliação/dia.
5. **Comentar** um banheiro.
6. **Ranking** — classificação geral com selos.
7. **Perfil** — dados, troca de nome/senha e histórico de avaliações.
8. **Sair** e entrar como **admin** (`admin@utfpr.edu.br` / `admin123`).
9. **Administração** — cadastrar um câmpus/localização/banheiro novo, editar, desativar
   (aparece como "Inativo") e mostrar que banheiro inativo some da home.
10. **Gerar insights agora** (botão no admin) e voltar ao detalhe do banheiro para mostrar
    os insights atualizados (melhor horário, pico, tendência, Trono de Ouro/Zona de Risco).
11. Encerre mostrando a rota protegida: deslogado, acessar `/admin` redireciona para a home,
    e `/perfil` redireciona para o login.
