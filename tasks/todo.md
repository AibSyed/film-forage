# Film Forage v4 Tonight Picker Rebuild

## Checklist
- [completed] Replace discovery-first IA with tonight-picker routes: `/`, `/search`, `/movie/[id]`, `/watchlist`, `/sources`.
- [completed] Replace legacy discovery contracts and adapters with truthful TMDB picker/search/detail contracts.
- [completed] Remove fake confidence/rationale language and any curated-detail assumptions.
- [completed] Rebuild the visual system as a useful screening-concierge product with strong mobile behavior.
- [completed] Remove dead dependencies, stale routes, and outdated docs.
- [completed] Add or refresh unit and e2e coverage for picking, search, detail, watchlist, and outage fallback.
- [completed] Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run test:e2e`, `pnpm run build`, `pnpm run docs:check`, `pnpm run audit:high`.
- [completed] Run Chrome DevTools QA for console cleanliness and responsive flow validation.

## Acceptance Criteria
- The home page helps a user choose a movie tonight instead of browsing a decorative discovery deck.
- Result cards only claim facts traceable to TMDB data or explicit user filters.
- Movie detail pages are backed by live TMDB ids, not static catalog ids.
- Watchlist state is local-first, versioned, and limited to saved movies, notes, recent searches, dismissed ids, and provider preferences.
- Sources and fallback behavior are explicit and user-readable.

## Verification Log
- `pnpm install`
- `pnpm exec next typegen`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run docs:check`
- `pnpm run audit:high`
- `pnpm run check`
- `pnpm dlx knip --no-progress`
- Chrome DevTools MCP on the local production build at `127.0.0.1:3101`:
  - desktop `/` console clean
  - mobile `/search` console clean
  - mobile `/watchlist` console clean
  - mobile `/sources` console clean
- Final local production confirmation at `127.0.0.1:32123`:
  - mobile `/` console clean
  - mobile `/watchlist` console clean
  - mobile `/sources` console clean
  - shared-shell navigation and footer verified on state pages
