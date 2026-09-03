# Task Flow — Design Spec

## Purpose

Portfolio project #1 of 4 (full-stack JS/TS set) built to demonstrate
fundamentals for a full-stack interview: data modeling, authentication,
authorization/ownership, REST API design, and a working React frontend.
Target audience: interviewer evaluating a junior full-stack candidate.

## Scope

A Kanban-style task manager. Users register/log in, create boards, and
manage tasks within boards through TODO / IN_PROGRESS / DONE columns.

Out of scope (explicitly not building): team/board sharing between
users, real-time collaboration (that's project #2 in the set), file
attachments, notifications/emails.

## Architecture

Single repo, two independently runnable services (no workspace tooling):

- `/server` — Express + TypeScript REST API, Prisma ORM, PostgreSQL.
- `/client` — React + TypeScript + Vite, React Router.

Root `README.md` documents local setup for both services and links to
the deployed demo.

## Data Model (Prisma / PostgreSQL)

- **User**: `id`, `email` (unique), `passwordHash`, `name`, `createdAt`.
- **Board**: `id`, `userId` (owner, FK), `title`, `createdAt`.
- **Task**: `id`, `boardId` (FK), `title`, `description?`, `status`
  (`TODO` | `IN_PROGRESS` | `DONE`), `order` (int, for drag & drop
  ordering within a column), `dueDate?`, `createdAt`, `updatedAt`.

A user has many boards; a board has many tasks. All queries for boards
and tasks are scoped by the authenticated user's `id` — ownership is
checked explicitly in each query/handler, never assumed from a joined
relation alone.

## Authentication

- Registration: `email` + `password` (bcrypt hash), `name`.
- Login issues:
  - **Access token** (JWT, 15 min expiry) returned in the JSON response
    body.
  - **Refresh token** (7 day expiry) set as an httpOnly, secure cookie.
- `POST /auth/refresh` rotates the refresh token and issues a new
  access token.
- `POST /auth/logout` clears the refresh cookie.
- Express middleware validates the `Authorization: Bearer <token>`
  header on all protected routes.
- Frontend keeps the access token in memory only (React context), never
  in `localStorage`; an HTTP client interceptor calls `/auth/refresh`
  transparently on 401 and retries the original request once.

## API Design (REST)

```
POST   /auth/register        { email, password, name } → 201
POST   /auth/login           { email, password } → { accessToken }, sets refresh cookie
POST   /auth/refresh         (cookie) → { accessToken }
POST   /auth/logout          → clears refresh cookie

GET    /boards                      → boards owned by the authenticated user
POST   /boards                      { title } → creates a board
GET    /boards/:boardId             → board + its tasks
PATCH  /boards/:boardId             { title }
DELETE /boards/:boardId

GET    /boards/:boardId/tasks
POST   /boards/:boardId/tasks       { title, description?, dueDate? }
PATCH  /tasks/:taskId               { title?, description?, status?, order?, dueDate? }
DELETE /tasks/:taskId
```

All routes except `/auth/*` require a valid access token. Request
bodies are validated with Zod. Errors use a consistent shape:

```json
{ "error": { "code": "STRING_CODE", "message": "human readable" } }
```

with HTTP status: 400 (validation), 401 (not authenticated), 403 (not
the owner), 404 (not found).

## Frontend

Pages: `/login`, `/register`, `/boards` (list), `/boards/:id` (Kanban
view with TODO/IN_PROGRESS/DONE columns and drag & drop via
`@dnd-kit`).

- `AuthContext` holds the current access token and user info in memory,
  exposes login/logout/register actions.
- `api/client.ts` centralizes HTTP calls, attaches the bearer token,
  and handles the refresh-and-retry flow on 401.
- Errors surface as toast notifications; forms show inline validation
  errors from the API's `error.message`.

## Testing

- **Backend**: Vitest + Supertest integration tests against a test
  database (SQLite in-memory or a disposable Postgres via Docker,
  whichever proves simpler in practice). Must cover: register/login
  flow, token refresh, and — critically — that a user cannot read,
  update, or delete another user's boards/tasks (403 checks).
- **Frontend**: Vitest + React Testing Library for the login form and
  the Kanban board component (rendering, status column moves).
- Lint (`eslint`) and typecheck (`tsc --noEmit`) as npm scripts; a
  Husky pre-commit hook running both is a nice-to-have, not a blocker.

## Deployment

- Backend + PostgreSQL: Render (free tier, managed Postgres).
- Frontend: Vercel, with `VITE_API_URL` pointing at the Render backend.
- CORS on the backend explicitly allow-lists the Vercel domain (no
  wildcard).

## Success Criteria

- A visitor can register, log in, create a board, add tasks, move them
  across statuses, and log out — end to end, on the deployed demo.
- Backend integration tests pass and demonstrably cover the
  cross-user ownership boundary.
- README lets a stranger clone and run both services locally in under
  10 minutes.
