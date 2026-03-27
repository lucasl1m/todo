# Todo App (React + Vite + Vercel Functions + Prisma)

Aplicacao de tarefas com frontend em React e backend serverless em `api/` com CRUD completo.

## Stack

- React + Vite + TypeScript
- Vercel Functions (`api/tasks`)
- Prisma ORM
- PostgreSQL (recomendado: Vercel Postgres no plano free)

## O que foi implementado

- Banco de dados com Prisma (`prisma/schema.prisma`)
- Endpoints CRUD:
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PATCH /api/tasks/:id`
  - `DELETE /api/tasks/:id`
- Integracao do frontend via contexto (`TasksProvider`) consumindo API
- Remocao de `localStorage`
- Loading com `Skeleton` antes de exibir tarefas

## Configuracao local

1. Instale dependencias:

```bash
pnpm install
```

2. Crie o arquivo `.env` com base em `.env.example`:

```bash
cp .env.example .env
```

3. Configure `DATABASE_URL` com sua conexao PostgreSQL.

4. Gere o client Prisma e aplique o schema:

```bash
pnpm prisma:generate
pnpm prisma:push
```

5. Rode a aplicacao:

```bash
pnpm dev
```

## Teste local com Docker

Este projeto inclui `docker-compose.yml` para subir o PostgreSQL local.

1. Suba o banco:

```bash
pnpm docker:up
```

2. Garanta que o `.env` tenha a URL local (igual ao `.env.example`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo?schema=public"
```

3. Sincronize o schema no banco do container:

```bash
pnpm prisma:push
```

4. Para testar frontend + endpoints `/api` juntos localmente, rode com Vercel CLI:

```bash
pnpm dlx vercel dev
```

5. Para parar os containers:

```bash
pnpm docker:down
```

## Deploy na Vercel com banco free

1. Crie um projeto na Vercel a partir deste repositorio.
2. No dashboard da Vercel, adicione **Vercel Postgres** (free).
3. Defina a variavel `DATABASE_URL` no projeto da Vercel com a URL do Postgres.
4. Em cada deploy, o `postinstall` ja executa `prisma generate` automaticamente.
5. Antes do primeiro deploy em producao, rode o schema no banco de producao:

```bash
pnpm prisma:push
```

## Scripts

- `pnpm dev` inicia ambiente local
- `pnpm build` gera build de producao
- `pnpm lint` valida codigo
- `pnpm prisma:generate` gera Prisma Client
- `pnpm prisma:push` sincroniza schema com banco
- `pnpm docker:up` sobe ambiente Docker local
- `pnpm docker:down` derruba ambiente Docker local
