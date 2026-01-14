# Light Doc ([Live Demo](https://light-doc.yueqian8.workers.dev))

A lightweight collaborative doc editor built with **TipTap + Yjs** on the frontend and **PartyServer (Cloudflare Durable Objects)** on the backend; inspired by the collaboration flow of [Excalidraw](https://excalidraw.com).

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

## Getting Started

To run this application:

```bash
pnpm install
npx wrangler d1 migrations apply light-doc-db --local
pnpm dev
```

## Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```