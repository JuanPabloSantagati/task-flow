# Task Flow

A full-stack Kanban task manager built to demonstrate authentication,
authorization, REST API design, and a React frontend.

Live demo: <pending deployment>

## Stack

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite, @dnd-kit
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

The backend deploys to [Render](https://render.com) and the frontend to
[Vercel](https://vercel.com).

### Backend (Render)

1. In the Render dashboard, create a new **Blueprint** and point it at this
   repository's `server/render.yaml`. The blueprint provisions a free
   PostgreSQL database (`task-flow-db`) and generates the `JWT_ACCESS_SECRET`
   and `JWT_REFRESH_SECRET` values automatically.
2. Set the `CORS_ORIGIN` environment variable on the `task-flow-server`
   service to your eventual Vercel URL (e.g. `https://task-flow.vercel.app`).
   You can leave a placeholder for now and update it once the frontend is
   deployed.
3. Deploy the blueprint. Render will build the server, run
   `prisma migrate deploy`, and start it.

### Frontend (Vercel)

1. Import this repository into Vercel and set the project's **root
   directory** to `client`.
2. Set the `VITE_API_URL` environment variable to your Render backend URL
   (e.g. `https://task-flow-server.onrender.com`).
3. Deploy. Vercel builds and serves the Vite app.

### Wiring the two together

Once the Vercel deployment has a URL, go back to the Render service and
update `CORS_ORIGIN` to that exact URL, then redeploy the backend so it
accepts cross-origin requests (including the credentialed refresh-token
cookie) from the deployed frontend.
