"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ClipboardList, RotateCcw, Trash2 } from "lucide-react";
import { buildWatchPlanText } from "@/features/workspace/copy-plan";
import {
  clearDismissedMovies,
  createWorkspaceDefaults,
  clearWorkspace,
  readWorkspace,
  removeSavedMovie,
  subscribeToWorkspace,
  updateMovieNote,
} from "@/features/workspace/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function WatchlistExperience() {
  const [workspace, setWorkspace] = useState(() => readWorkspace() ?? createWorkspaceDefaults());
  const [status, setStatus] = useState("");

  useEffect(() => {
    return subscribeToWorkspace(() => setWorkspace(readWorkspace()));
  }, []);

  const savedMovies = useMemo(() => workspace.savedMovies, [workspace.savedMovies]);

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(buildWatchPlanText(savedMovies));
      setStatus("Watch plan copied.");
    } catch {
      setStatus("Clipboard access was blocked. Copy the plan from a browser tab with clipboard permission.");
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
      <article className="rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--ink-muted)]">Watchlist</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)] md:text-4xl">Save picks you actually want to revisit.</h2>
            <p className="mt-3 max-w-2xl text-[var(--ink-dim)]">Keep your likely movies in one place, add a private note, and copy a clean list when you are ready.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={copyPlan} disabled={savedMovies.length === 0}><ClipboardList size={15} /> Copy plan</Button>
          </div>
        </div>

        {status ? <p className="mt-4 text-sm text-[var(--ink-dim)]">{status}</p> : null}

        {savedMovies.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--panel-muted)] p-8 text-sm text-[var(--ink-dim)]">
            Nothing is saved yet. Save a few picks from Home or Search and they will show up here.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {savedMovies.map((movie) => (
              <article key={movie.id} className="overflow-hidden rounded-[1.75rem] border border-[var(--line-soft)] bg-[var(--panel)] shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                <div className="grid gap-0 md:grid-cols-[160px_1fr]">
                  <div className="relative min-h-44 bg-[linear-gradient(135deg,rgba(192,153,86,0.35),rgba(69,89,110,0.55))]">
                    {movie.posterUrl ? (
                      <Image src={movie.posterUrl} alt={`${movie.title} poster`} fill className="object-cover" sizes="160px" />
                    ) : (
                      <div className="flex h-full items-end p-4 text-xs uppercase tracking-[0.24em] text-[var(--ink-muted)]">Poster unavailable</div>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
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
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </article>

      <aside className="rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:p-6">
        <h2 className="font-display text-3xl text-[var(--ink-strong)]">Saved only on this device</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-dim)]">
          <li>Saved picks and notes never leave this browser.</li>
          <li>Hidden titles are excluded from future refreshes.</li>
          <li>Recent search history stays local so you can revisit likely options quickly.</li>
          <li>Copy plan turns your saved titles into a plain text list for messages or notes.</li>
        </ul>
        <div className="mt-6 rounded-[1.2rem] border border-[var(--line-soft)] bg-[var(--panel)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Manage local data</p>
          <div className="mt-3 grid gap-2">
            <Button variant="subtle" size="sm" onClick={clearDismissedMovies}><RotateCcw size={15} /> Reset hidden picks</Button>
            <Button
              variant="subtle"
              size="sm"
              onClick={() => {
                if (window.confirm("Clear saved picks, notes, hidden titles, and search history on this device?")) {
                  clearWorkspace();
                }
              }}
            >
              <Trash2 size={15} /> Clear all local data
            </Button>
          </div>
        </div>
      </aside>
    </section>
  );
}
