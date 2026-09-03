# Task Flow

A full-stack Kanban task manager built to demonstrate authentication,
authorization, REST API design, and a React frontend.

Live demo: <fill in after Task 15/16 deploy>

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
