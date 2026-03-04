"use client";

import { useEffect, useMemo, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Film, Flame, ShieldCheck } from "lucide-react";
import { AppSelect } from "@/components/primitives/select";
import { DiscoveryCarousel } from "@/components/discovery/discovery-carousel";
import { ShortlistBoard } from "@/components/discovery/shortlist-board";
import { discoveryResponseSchema, type DiscoveryResponse, type MovieCard } from "@/features/discovery/schema";
import { readShortlist, writeShortlist } from "@/lib/state/shortlist";

const moodOptions = [
  { label: "Atmospheric", value: "atmospheric" },
  { label: "Adrenaline", value: "adrenaline" },
  { label: "Reflective", value: "reflective" },
  { label: "Playful", value: "playful" },
];

const genreOptions = [
  { label: "Sci-Fi", value: "sci-fi" },
  { label: "Drama", value: "drama" },
  { label: "Thriller", value: "thriller" },
  { label: "Animation", value: "animation" },
  { label: "Action", value: "action" },
];

async function fetchDiscovery(mood: string, genre: string, runtime: number) {
  const response = await fetch(`/api/discovery?mood=${mood}&genre=${genre}&runtime=${runtime}`);
  if (!response.ok) {
    throw new Error("Discovery feed unavailable");
  }
  const data = (await response.json()) as DiscoveryResponse;
  return discoveryResponseSchema.parse(data);
}

export function DiscoveryExperience() {
  const [mood, setMood] = useState("atmospheric");
  const [genre, setGenre] = useState("sci-fi");
  const [runtime, setRuntime] = useState(145);
  const [shortlist, setShortlist] = useState<MovieCard[]>(() => readShortlist());

  useEffect(() => {
    writeShortlist(shortlist);
  }, [shortlist]);

  const query = useQuery({
    queryKey: ["discovery", mood, genre, runtime],
    queryFn: () => fetchDiscovery(mood, genre, runtime),
  });

  const cards = query.data?.items ?? [];

  const healthTone = useMemo(() => {
    if (!query.data) {
      return "Loading";
    }
    if (query.data.meta.fallbackUsed) {
      return "Fallback";
    }
    return "Live";
  }, [query.data]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]" aria-label="Cinematic discovery stage">
      <div className="rounded-3xl border border-zinc-700 bg-zinc-950/75 p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-1"><Film size={14} /> Editorial Discovery</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-1">
            {query.data?.meta.fallbackUsed ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />} Source {healthTone}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-1"><Flame size={14} /> Runtime ≤ {runtime}m</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <AppSelect label="Mood" value={mood} onChange={setMood} options={moodOptions} />
          <AppSelect label="Genre" value={genre} onChange={setGenre} options={genreOptions} />
          <label className="space-y-3 text-sm text-zinc-300">
            <span>Runtime ceiling: {runtime}m</span>
            <Slider.Root value={[runtime]} min={75} max={220} step={5} onValueChange={(value) => setRuntime(value[0] ?? 145)} className="relative flex h-6 w-full touch-none items-center">
              <Slider.Track className="relative h-2 grow rounded-full bg-zinc-800">
                <Slider.Range className="absolute h-full rounded-full bg-amber-300" />
              </Slider.Track>
              <Slider.Thumb className="block h-4 w-4 rounded-full border border-zinc-700 bg-zinc-100" aria-label="Runtime" />
            </Slider.Root>
          </label>
        </div>

        <div role="status" aria-live="polite" className="mt-5 min-h-7 text-sm text-zinc-300">
          {query.isPending && <p>Tuning the reel to your mood signature...</p>}
          {query.isError && <p className="rounded-xl border border-red-500/40 bg-red-950/40 p-2 text-red-100">Live discovery failed. Using resilient fallback catalog.</p>}
          {query.data && <p>Feed confidence {(query.data.meta.confidence * 100).toFixed(0)}% · freshness {query.data.meta.freshnessHours}h</p>}
        </div>

        <div className="mt-4 min-h-[36rem]">
          <DiscoveryCarousel
            items={cards}
            onSave={(item) => {
              setShortlist((current) => (current.some((entry) => entry.id === item.id) ? current : [...current, item]));
            }}
          />
        </div>
      </div>

      <ShortlistBoard list={shortlist} setList={setShortlist} />
    </section>
  );
}
