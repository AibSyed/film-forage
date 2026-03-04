"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ClipboardList, RefreshCw, Trash2 } from "lucide-react";
import { curatedCatalog } from "@/features/discovery/catalog";
import type { MovieCard } from "@/features/discovery/schema";
import { readShortlist, writeShortlist } from "@/lib/state/shortlist";
import { ShortlistBoard } from "@/components/discovery/shortlist-board";

export function ShortlistHub() {
  const [shortlist, setShortlist] = useState<MovieCard[]>(() => readShortlist());

  const suggested = useMemo(
    () => curatedCatalog.filter((item) => !shortlist.some((entry) => entry.id === item.id)).slice(0, 3),
    [shortlist]
  );

  function updateList(updater: (current: MovieCard[]) => MovieCard[]) {
    setShortlist((current) => {
      const next = updater(current);
      writeShortlist(next);
      return next;
    });
  }

  function clearList() {
    writeShortlist([]);
    setShortlist([]);
  }

  async function copyPlan() {
    const lines = shortlist.map((entry, index) => `${index + 1}. ${entry.title} (${entry.year})`);
    await navigator.clipboard.writeText(lines.join("\n"));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <article className="rounded-3xl border border-zinc-700 bg-black/40 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Session Queue</p>
        <h1 className="mt-3 font-display text-6xl text-zinc-100 md:text-7xl">Noir Shortlist</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">
          Curate your watch order and keep your final picks export-ready. Reorder cards in the board and copy a
          plain-text plan for group chat.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-400"
            onClick={copyPlan}
            disabled={shortlist.length === 0}
          >
            <ClipboardList size={16} /> Copy watch plan
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-400"
            onClick={clearList}
            disabled={shortlist.length === 0}
          >
            <Trash2 size={16} /> Clear shortlist
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-400"
          >
            <RefreshCw size={16} /> Back to discovery
          </Link>
        </div>

        <div className="mt-8 grid gap-3">
          <h2 className="text-lg font-semibold text-zinc-100">Suggested additions</h2>
          {suggested.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => updateList((current) => [...current, entry])}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/70 p-4 text-left hover:border-amber-300/60"
            >
              <p className="font-display text-2xl text-zinc-100">{entry.title}</p>
              <p className="mt-1 text-sm text-zinc-300">{entry.genre} · {entry.runtimeMinutes}m</p>
              <p className="mt-2 text-sm text-amber-100">{entry.reason}</p>
            </button>
          ))}
          {suggested.length === 0 && <p className="text-sm text-zinc-400">All catalog picks are already in your shortlist.</p>}
        </div>
      </article>

      <ShortlistBoard list={shortlist} setList={updateList} />
    </section>
  );
}
