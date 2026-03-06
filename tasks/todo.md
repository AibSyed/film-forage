# Film Forage v4 Rebuild

## Checklist
- [completed] Replace discovery-first IA with Film Forage home/search/watchlist routes: `/`, `/search`, `/movie/[id]`, `/watchlist`, `/sources`.
- [completed] Replace legacy discovery contracts and adapters with truthful TMDB picker/search/detail contracts.
- [completed] Remove fake confidence/rationale language and any curated-detail assumptions.
- [completed] Rebuild the visual system as a useful screening-concierge product with strong mobile behavior.
- [completed] Remove dead dependencies, stale routes, and outdated docs.
- [completed] Add or refresh unit and e2e coverage for picking, search, detail, watchlist, and outage fallback.
- [completed] Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run test:e2e`, `pnpm run build`, `pnpm run docs:check`, `pnpm run audit:high`.
- [completed] Run Chrome DevTools QA for console cleanliness and responsive flow validation.
- [completed] Polish reserve-mode copy, presentation labels, and user-facing fallback messaging.

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


## Follow-up Polish Pass

### Checklist
- [completed] Remove unnecessary client/provider refetch churn and preserve saved notes on repeat save actions.
- [completed] Make recent-search persistence real in the search flow or remove copy that claims it.
- [completed] Tighten reserve-mode messaging so the UI stays useful and honest when live TMDB is unavailable.
- [completed] Re-run verification and production QA after the polish pass.

### Acceptance Criteria
- Toggling provider chips does not refetch the provider catalog unnecessarily.
- Saving an already-saved movie does not erase its private note.
- Search behavior matches local-history claims in the UI.
- Reserve-mode copy is plain-language and user-facing, not internal jargon.
- Verification and browser QA are refreshed after the follow-up edits.

- Production Vercel alias currently serves the v4 Film Forage UI but remains in reserve mode because TMDB provider data is unavailable.
- Live production `GET /api/providers` returned `{ "source": "unavailable" }` during post-merge verification.

- Follow-up polish verification:
  - `pnpm run check`
  - `pnpm run docs:check`
  - `pnpm run audit:high`
  - `pnpm dlx knip --no-progress`
  - `pnpm run test:e2e`


## UX Relaunch Pass

### Checklist
- [completed] Replace the oversized shared hero shell with a compact site frame and route-specific page headers.
- [completed] Rebuild the home page above-the-fold layout so the picker and best match are visible and credible on mobile and desktop.
- [completed] Rework navigation, spacing, and footer treatment so the app feels like a polished product instead of stacked cards.
- [completed] Tighten search, watchlist, and detail layouts so they inherit the new system cleanly.
- [completed] Re-run local verification and local browser QA with desktop and mobile screenshots.

### Acceptance Criteria
- Mobile home view shows a compact header, usable navigation, and useful picker content above the fold.
- Desktop home view feels deliberate, premium, and clearly structured around the decision task.
- Secondary routes share a coherent system without repeating oversized hero chrome.
- The fallback state remains honest, but it no longer dominates the visual experience.
- Browser QA confirms the new layout works on mobile and desktop without console issues.

### Verification Log
- `pnpm run check`
- `pnpm run test:e2e`
- `pnpm run docs:check`
- `pnpm run audit:high`
- `pnpm dlx knip --no-progress`
- Chrome DevTools MCP on `http://127.0.0.1:32125`:
  - mobile `/` console clean and captured in `tasks/final-home-mobile.png`
  - mobile `/search` console clean and captured in `tasks/final-search-mobile.png`
  - mobile `/watchlist` console clean and captured in `tasks/final-watchlist-mobile.png`
