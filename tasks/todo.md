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

## Auth + Layout Recovery Pass

### Checklist
- [completed] Restore live TMDB access by supporting TMDB's official bearer-token and v3 API-key auth modes server-side.
- [completed] Rebuild the home control surface so the movie cards use the width instead of living beside a cramped sticky sidebar.
- [completed] Re-run local verification, live production verification, and responsive browser QA after the auth/layout changes land.

### Acceptance Criteria
- Production TMDB provider and pick routes return live data again with the server-only env configuration.
- The home route leads with Film Forage branding, compact controls, and wide result cards on desktop and mobile.
- Footer, metadata, and nav copy center the Film Forage product identity instead of helper/internal labels.
- Docs and env guidance reflect the supported TMDB auth modes accurately.

## Live Data + Product Polish Pass

### Checklist
- [completed] Restore live TMDB data in Vercel without exposing secrets in the client bundle.
- [completed] Rework the home layout so Film Forage feels like a full-width picking tool, not a narrow side-rail shell.
- [completed] Remove the remaining internal/helper language and recenter the product on the Film Forage brand.
- [completed] Centralize duplicated TMDB/provider normalization where it materially reduces repetition.
- [completed] Refresh tests, docs, Vercel verification, and browser QA against the real live-data state.

### Acceptance Criteria
- Production `GET /api/providers` and `POST /api/pick` return live TMDB-backed data when the configured server secret is valid.
- The home page uses the available width cleanly on mobile and desktop, with the control surface and lead pick feeling like one product flow.
- Film Forage branding is primary in the page title, nav, footer, and hero copy; helper phrases remain secondary only.
- TMDB auth stays server-side and is compatible with either a TMDB read token or the legacy v3 API key stored in environment variables.
- Shared TMDB/provider normalization is centralized only where it removes real duplication.

### Verification Log
- `pnpm run lint`
- `pnpm exec tsc --noEmit --pretty false`
- `pnpm run test`
- `pnpm run build`
- `pnpm run docs:check`
- `pnpm run audit:high`
- `pnpm run test:e2e`
- `pnpm run check`
- `pnpm dlx knip --no-progress`
- Chrome DevTools MCP on `http://127.0.0.1:3201`:
  - desktop `/` console clean and captured in `tasks/live-home-desktop-final.png`
  - mobile `/` console clean and captured in `tasks/live-home-mobile-final.png`
  - form-field warning resolved on the redesigned picker


## Plain-Language Shortlist Pass

### Checklist
- [completed] Replace lead/backups language with a plain shortlist model users can understand immediately.
- [completed] Change the Film Forage type system so the app has its own utility-cinema identity instead of sharing a sibling-app feel.
- [completed] Re-run verification and local browser QA after the plain-language/product-model rewrite.

### Verification Log
- `pnpm run check`
- `pnpm run docs:check`
- `pnpm run audit:high`
- `pnpm dlx knip --no-progress`
- `pnpm run test:e2e`
- Chrome DevTools MCP on `http://127.0.0.1:32131`:
  - mobile `/` console clean and rechecked after rebuild/restart
  - desktop `/` screenshot captured in `tasks/local-home-desktop-plain.png`
  - mobile `/` screenshot captured in `tasks/local-home-mobile-plain.png`
## Distinct Product Identity Pass

### Checklist
- [completed] Replace the current lead/backups shortlist framing with a simpler browsing model users can understand immediately.
- [completed] Rebuild the home layout so the app feels full-width and movie-led instead of a narrow filter panel stacked over cards.
- [completed] Give Film Forage its own typography and tone so it stops reading like an Advicely sibling.
- [completed] Tighten footer/nav/supporting copy so branding is Film Forage-first and plain language only.
- [completed] Re-run verification and browser QA on desktop and mobile before merge.

### Acceptance Criteria
- The home page reads as a movie-finding tool, not an internal decision system.
- Primary result sections use plain labels that a first-time visitor understands without explanation.
- The visual system is clearly distinct from Advicely in typography, spacing, and layout behavior.
- Mobile and desktop both use the available width cleanly without cramped card rails.

### Verification Log
- `pnpm run check`
- `pnpm run test:e2e`
- `pnpm run docs:check`
- `pnpm run audit:high`
- `pnpm dlx knip --no-progress`
- Chrome DevTools MCP on `http://127.0.0.1:32142`:
  - desktop `/` console clean after the neo-noir palette and typography pass
  - mobile `/` rechecked with the compressed hero and fixed-width mobile nav

## Neo-Noir Contrast Pass

### Checklist
- [completed] Shift Film Forage from the warm editorial palette to a higher-contrast neo-noir visual system.
- [completed] Replace the display font with a sharper neo-noir type choice while keeping body copy readable.
- [completed] Revalidate home layout, nav fit, and contrast in Chrome on desktop and mobile.

### Acceptance Criteria
- Film Forage reads as neo-noir rather than generic or sibling-app adjacent.
- Text contrast stays readable across hero, controls, cards, and footer.
- Mobile nav fits the viewport cleanly without horizontal clipping.

### Verification Log
- `pnpm run check`
- `pnpm run test:e2e`
- `pnpm run docs:check`
- `pnpm run audit:high`
- `pnpm dlx knip --no-progress`
- Chrome DevTools MCP on `http://127.0.0.1:32142`:
  - desktop `/` screenshot reviewed locally
  - mobile `/` screenshot reviewed locally
  - console clean

## Final Cleanliness Sweep

### Checklist
- [completed] Re-verify code quality, tests, docs, and security after final nav contrast updates.
- [completed] Re-run dead-code/unused-dependency scan.
- [completed] Re-check browser console cleanliness and active-nav contrast behavior.

### Verification Log
- `pnpm run check`
- `pnpm run test:e2e`
- `pnpm run docs:check`
- `pnpm run audit:high`
- `pnpm dlx knip --no-progress`
- Chrome DevTools MCP on `http://localhost:3000`:
  - `/`, `/search`, `/watchlist`, `/sources` reload with no console errors
  - active nav computed style for selected route verified as `color: rgb(10, 17, 24)` on `background-color: rgb(239, 182, 94)` (dark-on-amber)
