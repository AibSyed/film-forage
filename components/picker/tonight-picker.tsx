"use client";

import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Search, Sparkles } from "lucide-react";
import {
  availabilityModes,
  genreOptions,
  launchRegions,
  pickRequestSchema,
  type PickResponseVM,
  type ProviderCatalogResponseVM,
  vibeOptions,
} from "@/features/picker/contracts";
import { defaultPickRequest } from "@/features/picker/defaults";
import {
  readWorkspace,
  setProviderPreference,
  setRegionPreference,
} from "@/features/workspace/storage";
import { MovieCard } from "@/components/movie/movie-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export function TonightPicker({
  initialPick,
  initialProviders,
}: {
  initialPick: PickResponseVM;
  initialProviders: ProviderCatalogResponseVM;
}) {
  const router = useRouter();
  const [pick, setPick] = useState(initialPick);
  const [providerCatalog, setProviderCatalog] = useState(initialProviders);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [searchPrompt, setSearchPrompt] = useState("");
  const [filters, setFilters] = useState(defaultPickRequest);

  const submitPick = useCallback(async (nextFilters: typeof filters, userInitiated = true) => {
    setPending(true);
    setStatus("");

    try {
      const payload = pickRequestSchema.parse(nextFilters);
      const nextPick = await requestJson<PickResponseVM>("/api/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setPick(nextPick);
      if (userInitiated) {
        setStatus(nextPick.meta.source === "live_tmdb" ? "Tonight picker refreshed." : "Live TMDB data is down. Showing the editorial reserve.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not refresh tonight's picks.");
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    const workspace = readWorkspace();
    const nextFilters = {
      ...defaultPickRequest,
      region: workspace.region,
      providers: workspace.providerIds,
      excludeIds: workspace.dismissedMovieIds,
    };

    setFilters(nextFilters);

    const shouldRefetch =
      workspace.region !== defaultPickRequest.region ||
      workspace.providerIds.length > 0 ||
      workspace.dismissedMovieIds.length > 0;

    if (shouldRefetch) {
      void submitPick(nextFilters, false);
    }
  }, [submitPick]);

  useEffect(() => {
    let active = true;

    async function loadProviders() {
      const data = await requestJson<ProviderCatalogResponseVM>(`/api/providers?region=${filters.region}`);
      if (active) {
        setProviderCatalog(data);
      }
    }

    void loadProviders();
    setRegionPreference(filters.region);
    setProviderPreference(filters.providers);

    return () => {
      active = false;
    };
  }, [filters.region, filters.providers]);

  const topProviders = useMemo(() => providerCatalog.providers.slice(0, 12), [providerCatalog.providers]);

  function toggleProvider(id: number) {
    setFilters((current) => ({
      ...current,
      providers: current.providers.includes(id)
        ? current.providers.filter((providerId) => providerId !== id)
        : [...current.providers, id].slice(0, 12),
    }));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
      <article className="rounded-[1.75rem] border border-[var(--line-soft)] bg-white/92 p-5 shadow-[0_20px_60px_rgba(44,33,20,0.08)] md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-muted)]">Tonight picker</p>
            <h2 className="mt-2 font-display text-4xl text-[var(--ink-strong)] md:text-5xl">Find one movie worth committing to.</h2>
          </div>
          <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-2 text-right text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            <p>{pick.meta.source === "live_tmdb" ? "Live TMDB" : "Editorial reserve"}</p>
            <p className="mt-1 text-[10px] tracking-[0.18em]">{filters.region}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Region</span>
            <SelectField value={filters.region} onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value, providers: [] }))}>
              {launchRegions.map((region) => (
                <option key={region.code} value={region.code}>{region.label}</option>
              ))}
            </SelectField>
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Availability</span>
            <SelectField value={filters.availabilityMode} onChange={(event) => setFilters((current) => ({ ...current, availabilityMode: event.target.value as typeof current.availabilityMode }))}>
              {availabilityModes.map((mode) => (
                <option key={mode.value} value={mode.value}>{mode.label}</option>
              ))}
            </SelectField>
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Genre</span>
            <SelectField value={filters.genre} onChange={(event) => setFilters((current) => ({ ...current, genre: event.target.value as typeof current.genre }))}>
              {genreOptions.map((genre) => (
                <option key={genre.value} value={genre.value}>{genre.label}</option>
              ))}
            </SelectField>
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Vibe</span>
            <SelectField value={filters.vibe} onChange={(event) => setFilters((current) => ({ ...current, vibe: event.target.value as typeof current.vibe }))}>
              {vibeOptions.map((vibe) => (
                <option key={vibe.value} value={vibe.value}>{vibe.label}</option>
              ))}
            </SelectField>
          </label>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="runtime" className="text-sm font-medium text-[var(--ink-main)]">Runtime cap</label>
            <span className="text-sm text-[var(--ink-dim)]">{filters.runtimeMax} min</span>
          </div>
          <input
            id="runtime"
            type="range"
            min={80}
            max={240}
            step={5}
            value={filters.runtimeMax}
            onChange={(event) => setFilters((current) => ({ ...current, runtimeMax: Number(event.target.value) }))}
            className="w-full accent-[var(--accent-strong)]"
          />
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[var(--ink-main)]">Services</p>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Optional</p>
          </div>
          {providerCatalog.source === "unavailable" ? (
            <p className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--panel-muted)] px-4 py-3 text-sm text-[var(--ink-dim)]">
              Provider filters are unavailable until live TMDB data returns. The picker still works without them.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topProviders.map((provider) => {
                const selected = filters.providers.includes(provider.id);
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => toggleProvider(provider.id)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${selected ? "border-[var(--accent-strong)] bg-[var(--accent-pale)] text-[var(--ink-strong)]" : "border-[var(--line-soft)] bg-white text-[var(--ink-dim)] hover:border-[var(--line-strong)] hover:text-[var(--ink-main)]"}`}
                  >
                    {provider.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Know part of the title?</span>
            <Input value={searchPrompt} onChange={(event) => setSearchPrompt(event.target.value)} placeholder="Try: Arrival, Spider-Man, Mission" />
          </label>
          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full md:w-auto"
              onClick={() => router.push(`/search?q=${encodeURIComponent(searchPrompt)}&region=${filters.region}` as Route)}
              disabled={searchPrompt.trim().length < 2}
            >
              <Search size={16} /> Search title
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => submitPick(filters)} disabled={pending}>
            <Film size={16} /> {pending ? "Refreshing..." : "Find a movie"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/watchlist" as Route)}>Open watchlist</Button>
        </div>

        {status ? <p className="mt-4 text-sm text-[var(--ink-dim)]">{status}</p> : null}
      </article>

      <div className="space-y-6">
        <article className="space-y-4 rounded-[1.75rem] border border-[var(--line-soft)] bg-[var(--panel)] p-4 md:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink-main)]">
            <Sparkles size={16} className="text-[var(--accent-strong)]" /> Best match
          </div>
          {pick.bestMatch ? (
            <div data-testid="best-match-card">
              <MovieCard movie={pick.bestMatch} onDismissed={(id) => setPick((current) => ({ ...current, bestMatch: current.bestMatch?.id === id ? null : current.bestMatch }))} />
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--line-strong)] bg-white/70 p-8 text-sm text-[var(--ink-dim)]">
              No strong live match yet. Try widening the runtime or removing a service filter.
            </div>
          )}
        </article>

        <section className="space-y-4 rounded-[1.75rem] border border-[var(--line-soft)] bg-white/92 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-3xl text-[var(--ink-strong)]">Good backups</h3>
              <p className="text-sm text-[var(--ink-dim)]">Keep a few solid alternates ready before everyone changes their mind.</p>
            </div>
            <Link href={"/watchlist" as Route} className="text-sm font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">View watchlist</Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {pick.backups.map((movie) => (
              <MovieCard key={movie.id} movie={movie} compact onDismissed={(id) => setPick((current) => ({ ...current, backups: current.backups.filter((entry) => entry.id !== id) }))} />
            ))}
          </div>
        </section>

        {pick.alternateLane.length > 0 ? (
          <section className="space-y-4 rounded-[1.75rem] border border-[var(--line-soft)] bg-white/92 p-4 md:p-5">
            <div>
              <h3 className="font-display text-3xl text-[var(--ink-strong)]">Try a different lane</h3>
              <p className="text-sm text-[var(--ink-dim)]">If your current services are thin tonight, these looser picks are still worth a look.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {pick.alternateLane.map((movie) => (
                <MovieCard key={movie.id} movie={movie} compact onDismissed={(id) => setPick((current) => ({ ...current, alternateLane: current.alternateLane.filter((entry) => entry.id !== id) }))} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
