# Lessons

- What went wrong: v3 spent design effort on cinematic theater language instead of helping the user make a cleaner movie decision.
- Root cause: the product surface was shaped around mood branding and invented rationale instead of the real TMDB data available to the app.
- Prevention rule: any Film Forage copy or UI state that explains why a movie fits must map directly to user-selected filters or returned provider/movie facts, and the tests should enforce that.

- What went wrong: duplicate partial-rewrite modules in `app`, `components`, `features`, and `lib` survived long enough to create stale imports and misleading type errors.
- Root cause: the branch already contained an overlapping rewrite surface, and I did not sweep the full tree for competing entrypoints before the first verification run.
- Prevention rule: after any large rewrite, run a whole-tree import sweep and an unused-code pass before the first lint/typecheck so only one architecture survives.
