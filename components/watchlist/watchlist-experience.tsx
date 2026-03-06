"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, RotateCcw, Trash2 } from "lucide-react";
import { buildWatchPlanText } from "@/features/workspace/copy-plan";
import {
  clearDismissedMovies,
  clearWorkspace,
  readWorkspace,
  removeSavedMovie,
  subscribeToWorkspace,
  updateMovieNote,
} from "@/features/workspace/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function WatchlistExperience() {
  const [workspace, setWorkspace] = useState(() => readWorkspace());
  const [status, setStatus] = useState("");

  useEffect(() => subscribeToWorkspace(() => setWorkspace(readWorkspace())), []);

  const savedMovies = useMemo(() => workspace.savedMovies, [workspace.savedMovies]);

  async function copyPlan() {
    await navigator.clipboard.writeText(buildWatchPlanText(savedMovies));
    setStatus("Watch plan copied.");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.78fr]">
      <article className="rounded-[1.75rem] border border-[var(--line-soft)] bg-white/92 p-5 shadow-[0_20px_60px_rgba(44,33,20,0.08)] md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--ink-muted)]">Local-first planning</p>
            <h2 className="mt-2 font-display text-4xl text-[var(--ink-strong)] md:text-5xl">Your watchlist</h2>
            <p className="mt-3 max-w-2xl text-[var(--ink-dim)]">Keep the picks that survived the group chat. Notes stay local in this browser.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={copyPlan} disabled={savedMovies.length === 0}><ClipboardList size={15} /> Copy plan</Button>
            <Button variant="subtle" size="sm" onClick={clearDismissedMovies}><RotateCcw size={15} /> Reset hidden picks</Button>
            <Button variant="subtle" size="sm" onClick={clearWorkspace}><Trash2 size={15} /> Clear all local data</Button>
          </div>
        </div>

        {status ? <p className="mt-4 text-sm text-[var(--ink-dim)]">{status}</p> : null}

        {savedMovies.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--line-strong)] bg-[var(--panel-muted)] p-8 text-sm text-[var(--ink-dim)]">
            Nothing is saved yet. Use the tonight picker or title search to build a short, practical watchlist.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {savedMovies.map((movie) => (
              <article key={movie.id} className="rounded-[1.5rem] border border-[var(--line-soft)] bg-[var(--panel)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-3xl text-[var(--ink-strong)]">{movie.title}</h3>
                    <p className="mt-1 text-sm text-[var(--ink-dim)]">{movie.year} · {movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : "Runtime unavailable"} · {movie.providerSummary.note}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeSavedMovie(movie.id)}>Remove</Button>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--ink-main)]">{movie.overview}</p>
                <div className="mt-4">
                  <label className="space-y-2 text-sm text-[var(--ink-main)]">
                    <span>Private note</span>
                    <Textarea value={movie.note} onChange={(event) => updateMovieNote(movie.id, event.target.value)} placeholder="Why did this stay on the list?" />
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}
      </article>

      <aside className="rounded-[1.75rem] border border-[var(--line-soft)] bg-[var(--panel)] p-5 md:p-6">
        <h2 className="font-display text-3xl text-[var(--ink-strong)]">What stays local</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-dim)]">
          <li>Saved picks and notes never leave this browser.</li>
          <li>Hidden titles are excluded from future tonight-picker results.</li>
          <li>Recent search history stays local so you can revisit likely options quickly.</li>
          <li>Copy plan exports a clean text list for text threads or notes, not a fake share layer.</li>
        </ul>
      </aside>
    </section>
  );
}
