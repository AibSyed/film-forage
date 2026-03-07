"use client";

import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Film, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  availabilityModes,
  genreOptions,
  launchRegions,
  pickRequestSchema,
  type MovieMatchCardVM,
  type PickResponseVM,
  type ProviderCatalogResponseVM,
  vibeOptions,
} from "@/features/picker/contracts";
import { defaultPickRequest } from "@/features/picker/defaults";
import { getPickerStatusMessage, getProviderFallbackMessage, getSourceLabel } from "@/features/picker/presentation";
import { readWorkspace, setProviderPreference, setRegionPreference } from "@/features/workspace/storage";
import { MovieCard } from "@/components/movie/movie-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export function PickerStudio({ initialPick, initialProviders }: { initialPick: PickResponseVM; initialProviders: ProviderCatalogResponseVM }) {
  const router = useRouter();
  const [pick, setPick] = useState(initialPick);
  const [providerCatalog, setProviderCatalog] = useState(initialProviders);
  const [pending, setPending] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [filters, setFilters] = useState(defaultPickRequest);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const submitPick = useCallback(async (nextFilters: typeof filters, userInitiated = true) => {
    setPending(true);

    try {
      const payload = pickRequestSchema.parse(nextFilters);
      const nextPick = await requestJson<PickResponseVM>("/api/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setPick(nextPick);
      if (userInitiated) {
        toast.success(getPickerStatusMessage(nextPick.meta.source));
      }
    } catch (error) {
      toast.error("Could not refresh movie picks.", {
        description: error instanceof Error ? error.message : "Try again in a moment.",
      });
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

    return () => {
      active = false;
    };
  }, [filters.region]);

  useEffect(() => {
    setProviderPreference(filters.providers);
  }, [filters.providers]);

  const topProviders = useMemo(() => providerCatalog.providers.slice(0, 12), [providerCatalog.providers]);
  const summaryFacts = useMemo(() => {
    const facts = [
      launchRegions.find((region) => region.code === filters.region)?.label ?? filters.region,
      availabilityModes.find((mode) => mode.value === filters.availabilityMode)?.label ?? filters.availabilityMode,
      `${filters.runtimeMax} min max`,
    ];

    if (filters.genre !== "any") {
      facts.push(genreOptions.find((genre) => genre.value === filters.genre)?.label ?? filters.genre);
    }

    if (filters.vibe !== "any") {
      facts.push(vibeOptions.find((vibe) => vibe.value === filters.vibe)?.label ?? filters.vibe);
    }

    if (filters.providers.length > 0) {
      facts.push(`${filters.providers.length} service${filters.providers.length === 1 ? "" : "s"}`);
    }

    return facts;
  }, [filters]);

  const topMatches = useMemo(() => {
    const cards: MovieMatchCardVM[] = [];
    if (pick.bestMatch) {
      cards.push(pick.bestMatch);
    }
    cards.push(...pick.backups.slice(0, 2));
    return cards;
  }, [pick.bestMatch, pick.backups]);

  const moreMatches = useMemo(() => [...pick.backups.slice(2), ...pick.alternateLane], [pick.backups, pick.alternateLane]);
  const updatedAtLabel = useMemo(() => {
    const parsed = new Date(pick.meta.requestedAt);
    if (Number.isNaN(parsed.getTime())) {
      return "just now";
    }

    return parsed.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }, [pick.meta.requestedAt]);

  function toggleProvider(id: number) {
    setFilters((current) => ({
      ...current,
      providers: current.providers.includes(id)
        ? current.providers.filter((providerId) => providerId !== id)
        : [...current.providers, id].slice(0, 12),
    }));
  }

  function dismissMovie(id: number) {
    setPick((current) => ({
      ...current,
      bestMatch: current.bestMatch?.id === id ? null : current.bestMatch,
      backups: current.backups.filter((entry) => entry.id !== id),
      alternateLane: current.alternateLane.filter((entry) => entry.id !== id),
    }));
  }

  return (
    <section className="space-y-6">
      <article className="rounded-[1.8rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.24)] md:p-6 lg:p-7">
        <div className="grid gap-4 lg:grid-cols-1 lg:items-end">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">Pick setup</p>
            <h2 className="font-display text-[1.85rem] leading-[1] text-[var(--ink-strong)] md:text-[2.5rem]">Set your preferences and get movie picks.</h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--ink-dim)]">
              Start with region and availability. Add genre, mood, or services only when you need to narrow the results.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_220px_220px_auto] xl:items-end">
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Know part of the title?</span>
            <Input id="title-prompt" name="titlePrompt" value={searchPrompt} onChange={(event) => setSearchPrompt(event.target.value)} placeholder="Try Arrival, Princess Bride, or Spider-Verse" />
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Region</span>
            <SelectField id="region" name="region" value={filters.region} onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value, providers: [] }))}>
              {launchRegions.map((region) => (
                <option key={region.code} value={region.code}>{region.label}</option>
              ))}
            </SelectField>
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Availability</span>
            <SelectField id="availability-mode" name="availabilityMode" value={filters.availabilityMode} onChange={(event) => setFilters((current) => ({ ...current, availabilityMode: event.target.value as typeof current.availabilityMode }))}>
              {availabilityModes.map((mode) => (
                <option key={mode.value} value={mode.value}>{mode.label}</option>
              ))}
            </SelectField>
          </label>
          <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:justify-end">
            <Button onClick={() => submitPick(filters)} disabled={pending}>
              <Film size={16} /> {pending ? "Finding..." : "Find a movie"}
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/search?q=${encodeURIComponent(searchPrompt)}&region=${filters.region}` as Route)} disabled={searchPrompt.trim().length < 2}>
              <Search size={16} /> Search title
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
          {summaryFacts.map((fact, index) => (
            <span key={fact} className="inline-flex items-center gap-2">
              {index > 0 ? <span className="text-[var(--ink-faint)]">/</span> : null}
              <span>{fact}</span>
            </span>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setFiltersOpen((current) => !current)} className="ml-auto">
            <SlidersHorizontal size={15} /> {filtersOpen ? "Hide extra filters" : "More filters"}
            <ChevronDown size={15} className={cn("transition", filtersOpen ? "rotate-180" : "")} />
          </Button>
        </div>

        <div className={cn("overflow-hidden transition-[max-height,opacity] duration-300", filtersOpen ? "mt-4 max-h-[52rem] opacity-100" : "max-h-0 opacity-0")}>
          <div className="grid gap-4 rounded-[1.4rem] border border-[var(--line-soft)] bg-[rgba(255,255,255,0.03)] p-4 md:grid-cols-2 xl:grid-cols-[220px_220px_1fr]">
            <label className="space-y-2 text-sm text-[var(--ink-main)]">
              <span>Genre</span>
              <SelectField id="genre" name="genre" value={filters.genre} onChange={(event) => setFilters((current) => ({ ...current, genre: event.target.value as typeof current.genre }))}>
                {genreOptions.map((genre) => (
                  <option key={genre.value} value={genre.value}>{genre.label}</option>
                ))}
              </SelectField>
            </label>
            <label className="space-y-2 text-sm text-[var(--ink-main)]">
              <span>Mood</span>
              <SelectField id="mood" name="mood" value={filters.vibe} onChange={(event) => setFilters((current) => ({ ...current, vibe: event.target.value as typeof current.vibe }))}>
                {vibeOptions.map((vibe) => (
                  <option key={vibe.value} value={vibe.value}>{vibe.label}</option>
                ))}
              </SelectField>
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="runtime" className="text-sm font-medium text-[var(--ink-main)]">Runtime</label>
                <span className="text-sm text-[var(--ink-dim)]">{filters.runtimeMax} min</span>
              </div>
              <input id="runtime" name="runtime" type="range" min={80} max={240} step={5} value={filters.runtimeMax} onChange={(event) => setFilters((current) => ({ ...current, runtimeMax: Number(event.target.value) }))} className="w-full accent-[var(--accent-strong)]" />
            </div>
            <div className="space-y-3 md:col-span-2 xl:col-span-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--ink-main)]">Services</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Optional</p>
              </div>
              {providerCatalog.source === "unavailable" ? (
                <p className="rounded-[1rem] border border-dashed border-[var(--line-strong)] bg-[var(--panel-muted)] px-4 py-3 text-sm leading-7 text-[var(--ink-dim)]">{getProviderFallbackMessage()}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {topProviders.map((provider) => {
                    const selected = filters.providers.includes(provider.id);
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => toggleProvider(provider.id)}
                        className={cn(
                          "rounded-md border px-3 py-2 text-sm transition",
                          selected
                            ? "border-[var(--accent-strong)] bg-[var(--accent-pale)] text-[var(--ink-strong)]"
                            : "border-[var(--line-soft)] bg-[var(--surface-soft)] text-[var(--ink-dim)] hover:border-[var(--line-strong)] hover:text-[var(--ink-main)]"
                        )}
                      >
                        {provider.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </article>

      <section className="space-y-4 rounded-[1.8rem] border border-[var(--line-soft)] bg-[linear-gradient(160deg,rgba(14,22,31,0.99),rgba(8,13,20,0.99))] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.28)] md:p-6 lg:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">Movie picks</p>
            <h3 className="font-display text-[2.1rem] leading-[0.95] text-[var(--ink-strong)] md:text-[3rem]">Movies picked for your current setup.</h3>
            <p className="max-w-3xl text-sm leading-7 text-[var(--ink-dim)]">
              These results update when you tap Find a movie. Movies you hide will not appear again until you reset hidden picks in Watchlist.
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">Source: {getSourceLabel(pick.meta.source)}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-faint)]">Last updated: {updatedAtLabel}</p>
          </div>
        </div>

        {pick.meta.source === "editorial_reserve" ? (
          <div className="rounded-[1.15rem] border border-[var(--line-strong)] bg-[var(--panel-muted)] px-4 py-3 text-sm leading-7 text-[var(--ink-dim)]">
            Live movie data is unavailable right now. Film Forage is showing reserve titles, so streaming availability may be missing until TMDB returns.
          </div>
        ) : null}

        {topMatches.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)] xl:items-start">
            <div data-testid="best-match-card">
              <MovieCard movie={topMatches[0]} onDismissed={dismissMovie} />
            </div>
            <div className="grid gap-4">
              {topMatches.slice(1).map((movie) => (
                <MovieCard key={movie.id} movie={movie} compact onDismissed={dismissMovie} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-8 text-sm text-[var(--ink-dim)]">
            No good matches yet. Try a longer runtime, switch availability to Anything, or search by title.
          </div>
        )}
      </section>

        {moreMatches.length > 0 ? (
        <section className="space-y-4 rounded-[1.8rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-5 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-[1.9rem] leading-[0.98] text-[var(--ink-strong)] md:text-[2.5rem]">More options</h3>
              <p className="text-sm text-[var(--ink-dim)]">More titles to try if the first picks are not the one.</p>
            </div>
            <Link href={("/watchlist" as Route)} className="text-sm font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">View watchlist</Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {moreMatches.map((movie) => (
              <MovieCard key={movie.id} movie={movie} compact onDismissed={dismissMovie} />
            ))}
          </div>
        </section>
      ) : null}

      {topMatches.length === 0 ? (
        <section className="rounded-[1.8rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-[1.9rem] leading-[0.98] text-[var(--ink-strong)] md:text-[2.4rem]">No matches yet</h3>
              <p className="text-sm text-[var(--ink-dim)]">Change your preferences or search by title to pull in more options.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setFiltersOpen(true)}>Open more options</Button>
              <Button variant="ghost" onClick={() => router.push("/search" as Route)}>Search by title</Button>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
