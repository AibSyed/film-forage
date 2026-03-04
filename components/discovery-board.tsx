"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookmarkPlus, Clapperboard, RefreshCcw } from "lucide-react";
import type { Movie } from "@/features/discovery/schema";

const moods = ["atmospheric", "intense", "playful", "focused"];
const genres = ["sci-fi", "drama", "animation", "action", "comedy"];

async function fetchMovies(mood: string, genre: string, runtime: number) {
  const response = await fetch(`/api/discovery?mood=${mood}&genre=${genre}&runtime=${runtime}`);
  if (!response.ok) {
    throw new Error("Failed to load discovery results");
  }

  const payload = (await response.json()) as { items: Movie[]; source: string };
  return payload;
}

export function DiscoveryBoard() {
  const [mood, setMood] = useState("atmospheric");
  const [genre, setGenre] = useState("sci-fi");
  const [runtime, setRuntime] = useState(150);
  const [saved, setSaved] = useState<Movie[]>([]);

  const query = useQuery({
    queryKey: ["discovery", mood, genre, runtime],
    queryFn: () => fetchMovies(mood, genre, runtime),
  });

  const lead = useMemo(() => query.data?.items?.[0], [query.data]);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-12 pt-4 md:grid-cols-[2fr_1fr]">
      <div className="space-y-6 rounded-3xl border border-slate-700 bg-slate-900/70 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 font-medium text-sky-200">
            <Clapperboard size={16} /> Discovery Engine
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-200">Source: {query.data?.source ?? "loading"}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Mood</span>
            <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={mood} onChange={(event) => setMood(event.target.value)}>
              {moods.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Genre</span>
            <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={genre} onChange={(event) => setGenre(event.target.value)}>
              {genres.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Max Runtime</span>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" type="number" min={70} max={240} value={runtime} onChange={(event) => setRuntime(Number(event.target.value))} />
          </label>
        </div>

        {query.isPending && <p className="text-slate-300">Calibrating your stack...</p>}
        {query.isError && <p className="rounded-lg border border-rose-400/40 bg-rose-950/40 p-3 text-rose-100">Discovery temporarily unavailable. Retry in a moment.</p>}

        {lead ? (
          <article className="grid gap-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 md:grid-cols-[1fr_2fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.posterUrl} alt={`${lead.title} poster`} className="h-72 w-full rounded-xl object-cover" />
            <div className="space-y-3">
              <h2 className="font-heading text-3xl">{lead.title}</h2>
              <p className="text-sm uppercase tracking-wide text-slate-400">{lead.year} · {lead.rating.toFixed(1)} / 10 · {lead.runtimeMinutes} min</p>
              <p className="text-slate-200">{lead.overview}</p>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-400"
                onClick={() => setSaved((current) => (current.find((movie) => movie.id === lead.id) ? current : [...current, lead]))}
              >
                <BookmarkPlus size={16} /> Save to shortlist
              </button>
            </div>
          </article>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          {query.data?.items?.slice(1, 7).map((movie) => (
            <article key={movie.id} className="rounded-xl border border-slate-700 bg-slate-900 p-3">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-xs text-slate-400">{movie.genre} · {movie.mood}</p>
            </article>
          ))}
        </div>
      </div>

      <aside className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl">Saved Stack</h2>
          <button className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white" onClick={() => query.refetch()}>
            <RefreshCcw size={14} /> Refresh
          </button>
        </div>
        <ul className="space-y-2">
          {saved.length === 0 && <li className="text-sm text-slate-400">No picks yet. Save your top discovery card.</li>}
          {saved.map((movie) => (
            <li key={movie.id} className="rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-sm">
              <strong>{movie.title}</strong>
              <p className="text-slate-400">{movie.genre} · {movie.year}</p>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
