# Lessons

- What went wrong: active navigation used low-legibility light text on the amber active pill and was hard to read.
- Root cause: I changed nav styling for brand tone without a contrast-focused regression check on the active state.
- Prevention rule: every nav/button state change must include an explicit contrast check for active/hover/focus states in mobile and desktop browser QA before sign-off.

- What went wrong: v3 spent design effort on cinematic theater language instead of helping the user make a cleaner movie decision.
- Root cause: the product surface was shaped around mood branding and invented rationale instead of the real TMDB data available to the app.
- Prevention rule: any Film Forage copy or UI state that explains why a movie fits must map directly to user-selected filters or returned provider/movie facts, and the tests should enforce that.

- What went wrong: duplicate partial-rewrite modules in `app`, `components`, `features`, and `lib` survived long enough to create stale imports and misleading type errors.
- Root cause: the branch already contained an overlapping rewrite surface, and I did not sweep the full tree for competing entrypoints before the first verification run.
- Prevention rule: after any large rewrite, run a whole-tree import sweep and an unused-code pass before the first lint/typecheck so only one architecture survives.

- What went wrong: user-facing copy still leaked internal fallback language and placeholder product phrasing after the first rewrite landed.
- Root cause: I validated the architecture and truthfulness rules, but I did not do a second pass that asked whether the copy still made sense to a normal viewer.
- Prevention rule: after any major rewrite, run a dedicated user-language sweep that replaces internal product terms with plain labels and back it with at least one regression test or tracked checklist item.

- What went wrong: the first Film Forage relaunch still looked overdesigned and under-reviewed because the shell and result cards were not re-checked as a product system in the browser.
- Root cause: I stopped after the structural rewrite passed verification instead of running a separate reviewer-style visual pass that challenged hierarchy, contrast, and above-the-fold usefulness.
- Prevention rule: for every non-trivial UI relaunch, require one explicit reviewer pass plus local desktop/mobile screenshots before declaring the UX complete.

- What went wrong: helper labels like "Tonight picker" started overshadowing the actual product name and made the app feel like an internal concept instead of Film Forage.
- Root cause: I let implementation-era feature naming leak into the core product framing instead of checking whether the identity still centered the brand the user is presenting publicly.
- Prevention rule: when product branding matters, make the branded noun the primary UI label and demote helper phrases to supporting copy only.

- What went wrong: I briefly reused an old exposed TMDB key while trying to restore production data.
- Root cause: I optimized for speed after confirming the historical key existed instead of pausing on the user's security preference for the new deployment.
- Prevention rule: if a secret was previously exposed, never reuse it for a fresh deployment unless the user explicitly approves that exact tradeoff in the current turn.

- What went wrong: I initially restored the TMDB env without checking that the new server runtime expected bearer-token auth while the historical value was a v3 API key.
- Root cause: I verified that the old key existed, but I did not verify the current integration's accepted TMDB auth modes before redeploying production.
- Prevention rule: when reviving a third-party credential from an older app, verify the current runtime's auth mechanism against the provider docs before assuming the same secret format will work.

- What went wrong: I pushed Film Forage polish while the live-data path was still broken, which made the UI review misleading because the product was stuck in reserve mode.
- Root cause: I treated layout polish and production data recovery as separate validation tracks instead of requiring a reviewer pass against the real live-data state.
- Prevention rule: never sign off on a data-driven product UI until either the live integration is working in production or an explicit fixture-based visual mode is used and documented for the review.

- What went wrong: I kept trying to polish Film Forage with local copy and spacing tweaks even though the core type system and home layout still looked like a generic shared app shell.
- Root cause: I optimized for preserving the existing component structure instead of stepping back and giving Film Forage its own visual system and wider decision-first layout.
- Prevention rule: if a product-specific UI still reads like a sibling app after one polish pass, reset the typography and primary layout before spending more time on micro-copy.

- What went wrong: the first Film Forage relaunch kept Advicely-adjacent typography, card density, and shell structure, so the product felt like a reused template instead of its own tool.
- Root cause: I treated copy cleanup and spacing fixes as sufficient polish instead of re-evaluating the entire visual system as a distinct product identity.
- Prevention rule: for every portfolio-facing app relaunch, explicitly compare typography, spacing, and layout language against sibling apps and reject any surface that still feels like a template variant.

- What went wrong: I kept using internal product language like lead picks, backups, and reserve shelf after the user made it clear Film Forage needs to read plainly to normal people.
- Root cause: I was still describing the internal recommendation model instead of the user's actual job: find a movie to watch tonight.
- Prevention rule: every new Film Forage heading, label, or helper sentence must pass a plain-language check: a first-time visitor should understand it without learning the product's internal model.

- What went wrong: the first plain-language pass still preserved a squished card-heavy shell and internal selection-model language, so the app remained hard to read as a mainstream movie tool.
- Root cause: I optimized for incremental copy cleanup instead of challenging the underlying layout, typography, and section model after the user rejected the overall experience.
- Prevention rule: when a user says a product still feels wrong after one polish pass, reset the page structure and section naming before doing another round of micro-copy or spacing tweaks.

- What went wrong: after the structural fix, the first refreshed visual system still leaned warm-editorial instead of the neo-noir identity the user actually wanted.
- Root cause: I improved layout and copy before explicitly validating the intended visual genre, so the palette and font choice solved sibling-app drift but missed the requested tone.
- Prevention rule: for a portfolio-facing redesign, confirm the intended visual genre early, then validate font and contrast choices against that target before calling the design pass complete.

- What went wrong: the home and supporting routes still leaked internal terms (`Data`, `backup picks`, system labels) and cluttered mobile with utility chrome.
- Root cause: I validated component polish but did not run a full cross-route copy and action-hierarchy consistency pass before sign-off.
- Prevention rule: before merge, run a route-by-route plain-language and mobile-hierarchy audit that normalizes labels (`Sources`, `Data source`, `Search by title`) and demotes destructive/secondary actions.
