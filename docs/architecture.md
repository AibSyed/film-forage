# Film Forage 2.0 Architecture

- Runtime: Next.js App Router, React 19, TypeScript strict mode.
- Data: Route Handler (`app/api/discovery`) + provider adapter (`lib/api/tmdb.ts`).
- Validation: Zod schemas in `features/discovery/schema.ts`.
- Caching/state: TanStack Query provider in `components/providers.tsx`.
- Security: headers in `next.config.ts`, CI audit gate, CodeQL workflow.
- UX: Mood/genre/runtime discovery with fallback data when upstream providers fail.
