# Star King OTT

A premium OTT streaming platform for movies, TV shows, and anime — powered by TMDB.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 4 + Wouter (deployed on Vercel)
- **Backend**: Express 5 + Node.js 20 (deployed on Render)
- **API data**: TMDB (The Movie Database) — backend proxies all requests
- **Monorepo**: pnpm workspaces, TypeScript 5.9

## Run & Operate

```bash
# Install all workspace packages from monorepo root
pnpm install

# Run the API server (reads PORT from env, falls back to 8080)
pnpm --filter @workspace/api-server run dev

# Run the frontend dev server (reads PORT from env, falls back to 3000)
pnpm --filter @workspace/starking-ott run dev

# Build the frontend for production
pnpm --filter @workspace/starking-ott run build

# Build the API server for production
pnpm --filter @workspace/api-server run build

# Full typecheck across all packages
pnpm run typecheck
```

## Environment Variables

### Backend (Render)
| Variable       | Required | Description |
|----------------|----------|-------------|
| `TMDB_API_KEY` | Yes      | TMDB API key from https://www.themoviedb.org/settings/api |
| `PORT`         | Auto     | Set automatically by Render — do not configure manually |
| `DATABASE_URL` | No       | PostgreSQL connection string (only if DB features are added) |

### Frontend (Vercel)
| Variable       | Required | Description |
|----------------|----------|-------------|
| `VITE_API_URL` | Yes      | Backend server root URL, **no trailing slash, no /api suffix** — e.g. `https://your-api.onrender.com` |

## Deployment

### Vercel (frontend)
- **Root Directory**: `.` (repo root)
- **Build Command**: `pnpm --filter @workspace/starking-ott run build` (or leave blank — vercel.json handles it)
- **Output Directory**: `artifacts/starking-ott/dist`
- **Install Command**: `pnpm install`
- Add `VITE_API_URL` in Vercel Environment Variables

### Render (backend)
- **Root Directory**: `.` (repo root)
- **Build Command**: `pnpm install && pnpm --filter @workspace/api-server run build`
- **Start Command**: `node --enable-source-maps artifacts/api-server/dist/index.mjs`
- Add `TMDB_API_KEY` in Render Environment Variables

## Where Things Live

- `artifacts/starking-ott/` — React/Vite frontend
- `artifacts/api-server/` — Express API server (TMDB proxy)
- `lib/api-client-react/` — React Query hooks (auto-generated + manual TMDB hooks)
- `lib/api-zod/` — Zod schemas generated from OpenAPI spec
- `lib/api-spec/` — OpenAPI spec + Orval codegen config
- `lib/db/` — Drizzle ORM database layer (future use)

## Architecture Decisions

- **Backend proxies TMDB** — The TMDB API key lives only on the backend, never exposed to the browser.
- **pnpm workspaces** — Shared libs (`lib/*`) are consumed by both frontend and backend via `workspace:*` protocol.
- **Orval for codegen** — The health check and schema types are generated; TMDB hooks are hand-written in `lib/api-client-react/src/tmdb.ts`.
- **setBaseUrl pattern** — The frontend calls `setBaseUrl(VITE_API_URL)` at startup; all API hooks then prepend this to their `/api/...` paths, making cross-domain calls work transparently.

## Gotchas

- `VITE_API_URL` must NOT include `/api` — the hooks already include that path prefix.
- Run `pnpm --filter @workspace/api-spec run codegen` after editing `lib/api-spec/openapi.yaml` to regenerate types.
- Run `pnpm --filter @workspace/db run push` to push schema changes to the database.

## User Preferences

_Populate as you build._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
