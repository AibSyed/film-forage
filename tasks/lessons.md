# Lessons

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
