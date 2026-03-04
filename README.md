# Film Forage 2.0

Film Forage is a cinematic discovery experience rebuilt from zero for modern performance, reliability, and product quality. It blends mood-driven curation with resilient live provider access and graceful fallback behavior.

## Highlights
- Intent-led discovery (mood, genre, runtime).
- Swipe-ready recommendation board and shortlist workflow.
- Strictly typed contracts (Zod) from provider to UI.
- Server-only secret handling with fallback when live provider is unavailable.

## Architecture
```mermaid
flowchart LR
  U[Player] --> UI[Next.js App Router UI]
  UI --> Q[TanStack Query Cache]
  Q --> RH[/app/api/discovery Route Handler]
  RH --> AD[TMDB Adapter]
  AD --> Z[Zod Contract Validation]
  AD --> TMDB[(TMDB API)]
  AD --> FB[(Curated Fallback Catalog)]
  Z --> UI
```

## Tech Stack
- Next.js 16 App Router
- React 19 + TypeScript (strict)
- TanStack Query v5
- Zod v4
- Tailwind CSS
- Vitest + Playwright

## Local Development
```bash
pnpm install
pnpm dev
```

## Verification Commands
```bash
pnpm run check
pnpm run test:e2e
pnpm run audit:high
```

## Environment
Copy `.env.example` to `.env.local` and fill values.

- `TMDB_ACCESS_TOKEN` (server-only): optional read-access token for live TMDB requests.
- `TMDB_BASE_URL`: defaults to `https://api.themoviedb.org/3`.

Security note: this project intentionally avoids `NEXT_PUBLIC_` for secrets.

## Product Reinvention Notes
- Legacy CRA architecture removed.
- Discovery experience redesigned with stronger pacing, clarity, and interaction quality.
- Failure-path UX is first-class: data outage still yields useful recommendations.
