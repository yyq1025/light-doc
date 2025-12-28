# Light Doc ([Live Demo](https://light-doc-web.yueqian8.workers.dev))

A lightweight collaborative doc editor built with **TipTap + Yjs** on the frontend and **PartyServer (Cloudflare Durable Objects)** on the backend; inspired by collaboration flow of [Excalidraw](https://excalidraw.com).

## Highlights

- **Real-time collaboration with CRDTs**: Yjs handles conflict-free edits and presence (multi-cursor) across tabs and users.
- **Offline-first UX**: documents persist locally via IndexedDB and become editable after local state sync completes.
- **Edge-native backend**: collaboration server runs on Cloudflare Workers + Durable Objects, with persistence to **Cloudflare D1** via **Drizzle ORM**.
- **Modern TypeScript stack**: React 19, TanStack Start/Router, Vite, and end-to-end type-safe patterns.
- **Production-minded tooling**: Biome for lint/format, Zod for runtime validation, and shadcn/ui components.

## Features

- Rich-text editing (headings, lists, code blocks, blockquotes, text alignment, highlight, etc.)
- Markdown import (`.md`) with confirmation dialog
- Export to Markdown (`.md`) and HTML (`.html`)
- “Share link” collaboration sessions (`/?room=...`) with presence avatars and colored carets
- Solo mode still supports cross-tab sync and local persistence

## Architecture (high level)

- `web/`: React app that hosts the TipTap editor and connects to a Yjs provider.
  - Uses `y-indexeddb` for local persistence.
  - Uses `y-partyserver` when `room` is present, otherwise a WebRTC provider for local/cross-tab sync.
- `partyserver/`: Cloudflare Worker that routes PartyServer requests and hosts a `YServer` implementation.
  - Loads/saves Yjs document state into `y_docs` table in D1 using Drizzle ORM.

## Local development

Backend (PartyServer):

```bash
cd partyserver
pnpm install
pnpm dev
```

Frontend (Web):

```bash
cd web
pnpm install
pnpm dev
```

Notes:
- `web/.env.local` contains `VITE_PARTYSERVER_URL=localhost:8787`.
- Open `http://localhost:3000`, click **Share → Start Session**, then open the copied link in another browser/tab to see live collaboration.

## Deploy

```bash
cd partyserver
pnpm deploy
```

```bash
cd web
pnpm deploy
```

## Repo layout

- `web/` – frontend app (TipTap + Yjs, TanStack Start/Router, Tailwind)
- `partyserver/` – collaboration backend (PartyServer, Durable Objects, D1, Drizzle)

