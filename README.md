# Task Flow

A full-stack Kanban task manager built to demonstrate authentication,
authorization, REST API design, and a React frontend.

Live demo: [https://task-flow-six-smoky.vercel.app](https://task-flow-six-smoky.vercel.app) (backend: [Railway](https://task-flow-server-production-c71f.up.railway.app))

## Stack

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS, @dnd-kit
- Testing: Vitest, Supertest, React Testing Library

## Running locally

### Prerequisites

- Node.js 20+
- A local PostgreSQL instance

### Backend

```bash
cd server
cp .env.example .env   # fill in DATABASE_URL and JWT secrets
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000
```

### Frontend

```bash
cd client
cp .env.example .env    # points VITE_API_URL at the backend
npm install
npm run dev              # http://localhost:5173
```

### Tests

```bash
cd server && npm test
cd client && npm test
```

## Deployment

The live demo runs backend on [Railway](https://railway.com) and frontend
on [Vercel](https://vercel.com). A `server/render.yaml` is also included if
you'd rather deploy the backend to [Render](https://render.com) instead —
Render's Blueprint feature picks it up automatically (note: Render requires
card verification even for its free tier; Railway does not).

### Backend (Railway)

1. Create a new Railway project, add a **PostgreSQL** database service, and
   add an **empty service** for the backend.
2. Set these environment variables on the backend service:
   - `DATABASE_URL` — reference the Postgres service's connection string:
     `${{Postgres.DATABASE_URL}}`
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any random strings (e.g.
     `openssl rand -hex 32`)
   - `NODE_ENV=production`
   - `CORS_ORIGIN` — your eventual Vercel URL (update once deployed)
3. Deploy the `server/` directory as that service's source (e.g. with the
   Railway CLI: `railway up server --path-as-root --service <name>`, or by
   connecting the GitHub repo and setting its root directory to `server`).
   `server/railway.json` sets the start command to run
   `prisma migrate deploy` before `npm start` on every deploy.
4. Generate a public domain for the service (Railway dashboard, or
   `railway domain`) — this is your backend URL.

### Frontend (Vercel)

1. Import this repository into Vercel and set the project's **root
   directory** to `client`.
2. Set the `VITE_API_URL` environment variable to your backend's public URL.
3. Deploy. Vercel builds and serves the Vite app.

### Wiring the two together

Once the Vercel deployment has a URL, go back to the backend service and
update `CORS_ORIGIN` to that exact URL, then redeploy so it accepts
cross-origin requests (including the credentialed refresh-token cookie)
from the deployed frontend.

---

# Task Flow (Español)

Un gestor de tareas estilo Kanban full-stack, construido para demostrar
autenticación, autorización, diseño de API REST y un frontend en React.

Demo en vivo: [https://task-flow-six-smoky.vercel.app](https://task-flow-six-smoky.vercel.app) (backend: [Railway](https://task-flow-server-production-c71f.up.railway.app))

## Stack

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS, @dnd-kit
- Testing: Vitest, Supertest, React Testing Library

## Correr el proyecto localmente

### Requisitos previos

- Node.js 20+
- Una instancia local de PostgreSQL

### Backend

```bash
cd server
cp .env.example .env   # completar DATABASE_URL y los secretos JWT
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000
```

### Frontend

```bash
cd client
cp .env.example .env    # apunta VITE_API_URL al backend
npm install
npm run dev              # http://localhost:5173
```

### Tests

```bash
cd server && npm test
cd client && npm test
```

## Deploy

La demo en vivo corre el backend en [Railway](https://railway.com) y el
frontend en [Vercel](https://vercel.com). También se incluye un
`server/render.yaml` por si preferís deployar el backend en
[Render](https://render.com) — su función de Blueprint lo detecta
automáticamente (nota: Render pide verificación con tarjeta incluso para
su plan gratuito; Railway no).

### Backend (Railway)

1. Creá un proyecto nuevo en Railway, agregá un servicio de base de datos
   **PostgreSQL**, y agregá un **servicio vacío** para el backend.
2. Configurá estas variables de entorno en el servicio del backend:
   - `DATABASE_URL` — referenciá el connection string del servicio
     Postgres: `${{Postgres.DATABASE_URL}}`
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — cualquier string
     aleatorio (por ejemplo, `openssl rand -hex 32`)
   - `NODE_ENV=production`
   - `CORS_ORIGIN` — tu futura URL de Vercel (actualizala una vez
     deployado el frontend)
3. Deployá el directorio `server/` como el código fuente de ese servicio
   (por ejemplo con la CLI de Railway:
   `railway up server --path-as-root --service <nombre>`, o conectando el
   repo de GitHub y configurando su directorio raíz en `server`).
   `server/railway.json` define el comando de arranque para correr
   `prisma migrate deploy` antes de `npm start` en cada deploy.
4. Generá un dominio público para el servicio (desde el dashboard de
   Railway, o con `railway domain`) — esa es la URL de tu backend.

### Frontend (Vercel)

1. Importá este repositorio en Vercel y configurá el **directorio raíz**
   del proyecto en `client`.
2. Configurá la variable de entorno `VITE_API_URL` con la URL pública de
   tu backend.
3. Deployá. Vercel construye y sirve la app de Vite.

### Conectando ambos

Una vez que el deploy de Vercel tenga una URL, volvé al servicio del
backend y actualizá `CORS_ORIGIN` con esa URL exacta, y volvé a deployar
para que acepte solicitudes cross-origin (incluida la cookie con
credenciales del refresh token) desde el frontend deployado.
