"use client";

import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Film, Search, SlidersHorizontal, Sparkles } from "lucide-react";
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
import { getPickerStatusMessage, getProviderFallbackMessage, getSourceLabel } from "@/features/picker/presentation";
import { readWorkspace, setProviderPreference, setRegionPreference } from "@/features/workspace/storage";
import { MovieCard } from "@/components/movie/movie-card";
import { Badge } from "@/components/ui/badge";
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
        setStatus(getPickerStatusMessage(nextPick.meta.source));
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not refresh Film Forage right now.");
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
      `${filters.runtimeMax} min cap`,
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

  function toggleProvider(id: number) {
    setFilters((current) => ({
      ...current,
      providers: current.providers.includes(id)
        ? current.providers.filter((providerId) => providerId !== id)
        : [...current.providers, id].slice(0, 12),
    }));
  }

  return (
    <section className="space-y-5">
      <article className="rounded-[1.6rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.22)] md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line-soft)] pb-4">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-ink)]">
              <Sparkles size={14} /> Forage controls
            </p>
            <h2 className="font-display text-[1.9rem] tracking-[-0.05em] text-[var(--ink-strong)] md:text-[2.5rem]">
              Set the lane, then let Film Forage narrow it.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--ink-dim)]">
              Use the fast controls first. Open the deeper filters only when you need to tighten the shortlist.
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--line-soft)] bg-[var(--panel)] px-4 py-3 text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">Data source</p>
            <p className="mt-1 text-sm font-semibold text-[var(--ink-main)]">{getSourceLabel(pick.meta.source)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_200px_220px_auto] xl:items-end">
          <label className="space-y-2 text-sm text-[var(--ink-main)] xl:col-span-1" htmlFor="title-query">
            <span>Know part of the title?</span>
            <Input
              id="title-query"
              name="titleQuery"
              value={searchPrompt}
              onChange={(event) => setSearchPrompt(event.target.value)}
              placeholder="Try Arrival, Princess Bride, Spider-Verse"
            />
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]" htmlFor="picker-region">
            <span>Region</span>
            <SelectField
              id="picker-region"
              name="region"
              value={filters.region}
              onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value, providers: [] }))}
            >
              {launchRegions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.label}
                </option>
              ))}
            </SelectField>
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]" htmlFor="picker-availability">
            <span>Availability</span>
            <SelectField
              id="picker-availability"
              name="availabilityMode"
              value={filters.availabilityMode}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  availabilityMode: event.target.value as typeof current.availabilityMode,
                }))
              }
            >
              {availabilityModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </SelectField>
          </label>
          <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:justify-end">
            <Button onClick={() => submitPick(filters)} disabled={pending}>
              <Film size={16} /> {pending ? "Finding..." : "Find a movie"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(`/search?q=${encodeURIComponent(searchPrompt)}&region=${filters.region}` as Route)}
              disabled={searchPrompt.trim().length < 2}
            >
              <Search size={16} /> Search title
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {summaryFacts.map((fact) => (
            <Badge key={fact} className="bg-[var(--panel)] text-[var(--ink-main)]">
              {fact}
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setFiltersOpen((current) => !current)} className="ml-auto">
            <SlidersHorizontal size={15} /> {filtersOpen ? "Hide filters" : "More filters"}
            <ChevronDown size={15} className={cn("transition", filtersOpen ? "rotate-180" : "")} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push("/watchlist" as Route)}>
            Watchlist
          </Button>
        </div>

        <div className={cn("overflow-hidden transition-[max-height,opacity] duration-300", filtersOpen ? "mt-4 max-h-[48rem] opacity-100" : "max-h-0 opacity-0") }>
          <div className="grid gap-4 rounded-[1.3rem] border border-[var(--line-soft)] bg-[rgba(255,255,255,0.03)] p-4 md:grid-cols-2 xl:grid-cols-[200px_220px_1fr]">
            <label className="space-y-2 text-sm text-[var(--ink-main)]" htmlFor="picker-genre">
              <span>Genre</span>
              <SelectField id="picker-genre" name="genre" value={filters.genre} onChange={(event) => setFilters((current) => ({ ...current, genre: event.target.value as typeof current.genre }))}>
                {genreOptions.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </SelectField>
            </label>
            <label className="space-y-2 text-sm text-[var(--ink-main)]" htmlFor="picker-vibe">
              <span>Vibe</span>
              <SelectField id="picker-vibe" name="vibe" value={filters.vibe} onChange={(event) => setFilters((current) => ({ ...current, vibe: event.target.value as typeof current.vibe }))}>
                {vibeOptions.map((vibe) => (
                  <option key={vibe.value} value={vibe.value}>
                    {vibe.label}
                  </option>
                ))}
              </SelectField>
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="runtime" className="text-sm font-medium text-[var(--ink-main)]">Runtime cap</label>
                <span className="text-sm text-[var(--ink-dim)]">{filters.runtimeMax} min</span>
              </div>
              <input
                id="runtime"
                name="runtimeMax"
                type="range"
                min={80}
                max={240}
                step={5}
                value={filters.runtimeMax}
                onChange={(event) => setFilters((current) => ({ ...current, runtimeMax: Number(event.target.value) }))}
                className="w-full accent-[var(--accent-strong)]"
              />
            </div>
            <div className="space-y-3 md:col-span-2 xl:col-span-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--ink-main)]">Services</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Optional</p>
              </div>
              {providerCatalog.source === "unavailable" ? (
                <p className="rounded-[1rem] border border-dashed border-[var(--line-strong)] bg-[var(--panel-muted)] px-4 py-3 text-sm leading-7 text-[var(--ink-dim)]">
                  {getProviderFallbackMessage()}
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
                        className={cn(
                          "rounded-full border px-3 py-2 text-sm transition",
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

        {status ? <p className="mt-4 text-sm text-[var(--ink-dim)]">{status}</p> : null}
      </article>

      <article className="space-y-4 rounded-[1.6rem] border border-[var(--line-soft)] bg-[linear-gradient(160deg,rgba(17,26,34,0.98),rgba(12,19,24,0.98))] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.24)] md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-ink)]">Lead pick</p>
            <h3 className="font-display text-[2rem] tracking-[-0.05em] text-[var(--ink-strong)] md:text-[2.8rem]">
              Start here.
            </h3>
            <p className="max-w-3xl text-sm leading-7 text-[var(--ink-dim)]">
              One credible lead first. Move to the backups only if the first option gets vetoed.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">{getSourceLabel(pick.meta.source)}</p>
        </div>

        {pick.meta.source === "editorial_reserve" ? (
          <div className="rounded-[1.15rem] border border-[var(--line-strong)] bg-[var(--panel-muted)] px-4 py-3 text-sm leading-7 text-[var(--ink-dim)]">
            Live TMDB data is unavailable right now. Film Forage is showing the reserve shelf, and streaming availability may be missing until TMDB returns.
          </div>
        ) : null}

        {pick.bestMatch ? (
          <div data-testid="best-match-card">
            <MovieCard
              movie={pick.bestMatch}
              onDismissed={(id) =>
                setPick((current) => ({
                  ...current,
                  bestMatch: current.bestMatch?.id === id ? null : current.bestMatch,
                }))
              }
            />
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-8 text-sm text-[var(--ink-dim)]">
            No strong match yet. Widen the runtime, loosen the service filter, or search directly.
          </div>
        )}
      </article>

      <section className="space-y-4 rounded-[1.6rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-[1.8rem] tracking-[-0.05em] text-[var(--ink-strong)] md:text-[2.3rem]">Good backups</h3>
            <p className="text-sm text-[var(--ink-dim)]">Keep a few credible alternates nearby without turning the page into another content dump.</p>
          </div>
          <Link href={("/watchlist" satisfies Route)} className="text-sm font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">
            View watchlist
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {pick.backups.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              compact
              onDismissed={(id) => setPick((current) => ({ ...current, backups: current.backups.filter((entry) => entry.id !== id) }))}
            />
          ))}
        </div>
      </section>

      {pick.alternateLane.length > 0 ? (
        <section className="space-y-4 rounded-[1.6rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-5">
          <div>
            <h3 className="font-display text-[1.8rem] tracking-[-0.05em] text-[var(--ink-strong)] md:text-[2.3rem]">Try another lane</h3>
            <p className="text-sm text-[var(--ink-dim)]">If the first pass feels too narrow, these widen the field without collapsing into noise.</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {pick.alternateLane.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                compact
                onDismissed={(id) =>
                  setPick((current) => ({
                    ...current,
                    alternateLane: current.alternateLane.filter((entry) => entry.id !== id),
                  }))
                }
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
