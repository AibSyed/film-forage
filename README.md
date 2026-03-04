# Film Forage 2.0

Film Forage is now a cinematic discovery engine with mood-led recommendations, resilient provider adapters, and a typed domain model.

## Stack
- Next.js 16 App Router
- React 19 + TypeScript strict mode
- TanStack Query v5
- Zod validation
- Tailwind CSS
- Vitest + Playwright

## Development
```bash
pnpm install
pnpm dev
```

## Verification
```bash
pnpm run check
pnpm run test:e2e
pnpm run audit:high
```

## Environment
- `TMDB_API_KEY` (optional): enables live TMDB-backed discovery.
- Without API key, app serves curated fallback recommendations.
