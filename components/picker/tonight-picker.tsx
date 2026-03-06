"use client";

import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Film, Search, Sparkles, SlidersHorizontal } from "lucide-react";
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
  getPickerStatusMessage,
  getSourceLabel,
} from "@/features/picker/presentation";
import {
  readWorkspace,
  setProviderPreference,
  setRegionPreference,
} from "@/features/workspace/storage";
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

    return () => {
      active = false;
    };
  }, [filters.region]);

  useEffect(() => {
    setProviderPreference(filters.providers);
  }, [filters.providers]);

  const topProviders = useMemo(() => providerCatalog.providers.slice(0, 12), [providerCatalog.providers]);
  const quickFacts = [
    launchRegions.find((region) => region.code === filters.region)?.label ?? filters.region,
    availabilityModes.find((mode) => mode.value === filters.availabilityMode)?.label ?? filters.availabilityMode,
    `${filters.runtimeMax} min cap`,
  ];

  function toggleProvider(id: number) {
    setFilters((current) => ({
      ...current,
      providers: current.providers.includes(id)
        ? current.providers.filter((providerId) => providerId !== id)
        : [...current.providers, id].slice(0, 12),
    }));
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1.08fr)_24rem]">
      <div className="order-1 space-y-5">
        <article className="space-y-4 rounded-[2rem] border border-[var(--line-soft)] bg-[linear-gradient(160deg,rgba(15,31,40,0.96),rgba(9,20,28,0.94))] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.26)] md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink-main)]">
                <Sparkles size={16} className="text-[var(--accent-strong)]" /> Best match
              </div>
              <p className="max-w-xl text-sm leading-7 text-[var(--ink-dim)]">
                Start with one usable answer from Film Forage, then keep the alternates nearby if the room changes direction.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">Start here</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickFacts.map((fact) => (
              <span key={fact} className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                {fact}
              </span>
            ))}
          </div>
          {pick.bestMatch ? (
            <div data-testid="best-match-card">
              {pick.bestMatch.fitReasons[0] ? (
                <p className="mb-3 rounded-[1.2rem] border border-[var(--line-soft)] bg-[rgba(6,18,25,0.34)] px-4 py-3 text-sm text-[var(--ink-main)]">
                  Tonight&apos;s lead because it is <span className="text-[var(--ink-strong)]">{pick.bestMatch.fitReasons[0].toLowerCase()}</span>.
                </p>
              ) : null}
              <MovieCard movie={pick.bestMatch} onDismissed={(id) => setPick((current) => ({ ...current, bestMatch: current.bestMatch?.id === id ? null : current.bestMatch }))} />
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-8 text-sm text-[var(--ink-dim)]">
              No strong live match yet. Try widening the runtime or removing a service filter.
            </div>
          )}
        </article>

        <section className="space-y-4 rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-3xl text-[var(--ink-strong)]">Good backups</h3>
              <p className="text-sm text-[var(--ink-dim)]">Keep a few solid alternates ready before everyone changes their mind.</p>
            </div>
            <Link href={"/watchlist" as Route} className="text-sm font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">View watchlist</Link>
          </div>
          <div className="grid gap-4 2xl:grid-cols-2">
            {pick.backups.map((movie) => (
              <MovieCard key={movie.id} movie={movie} compact onDismissed={(id) => setPick((current) => ({ ...current, backups: current.backups.filter((entry) => entry.id !== id) }))} />
            ))}
          </div>
        </section>

        {pick.alternateLane.length > 0 ? (
          <section className="space-y-4 rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-5">
            <div>
              <h3 className="font-display text-3xl text-[var(--ink-strong)]">Try a different lane</h3>
              <p className="text-sm text-[var(--ink-dim)]">If your current services are thin tonight, these looser picks are still worth a look.</p>
            </div>
            <div className="grid gap-4 2xl:grid-cols-2">
              {pick.alternateLane.map((movie) => (
                <MovieCard key={movie.id} movie={movie} compact onDismissed={(id) => setPick((current) => ({ ...current, alternateLane: current.alternateLane.filter((entry) => entry.id !== id) }))} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="order-2">
        <article className="rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.24)] md:p-6 xl:sticky xl:top-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-muted)]">Forage controls</p>
              <h2 className="mt-2 font-display text-3xl text-[var(--ink-strong)] md:text-[2.4rem]">Tune the forage, then commit.</h2>
              <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--ink-dim)]">
                Keep the decision surface simple. Search directly if you already know the title, or adjust a few filters and rerun.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2 text-right text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              <p>{getSourceLabel(pick.meta.source)}</p>
              <p className="mt-1 text-[10px] tracking-[0.18em]">{filters.region}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_180px]">
            <label className="space-y-2 text-sm text-[var(--ink-main)]">
              <span>Know part of the title?</span>
              <Input value={searchPrompt} onChange={(event) => setSearchPrompt(event.target.value)} placeholder="Try: Arrival, Spider-Man, Mission" />
            </label>
            <label className="space-y-2 text-sm text-[var(--ink-main)]">
              <span>Region</span>
              <SelectField value={filters.region} onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value, providers: [] }))}>
                {launchRegions.map((region) => (
                  <option key={region.code} value={region.code}>{region.label}</option>
                ))}
              </SelectField>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => submitPick(filters)} disabled={pending}>
              <Film size={16} /> {pending ? "Refreshing..." : "Find a movie"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(`/search?q=${encodeURIComponent(searchPrompt)}&region=${filters.region}` as Route)}
              disabled={searchPrompt.trim().length < 2}
            >
              <Search size={16} /> Search title
            </Button>
            <Button variant="secondary" onClick={() => router.push("/watchlist" as Route)}>Watchlist</Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickFacts.map((fact) => (
              <span key={fact} className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                {fact}
              </span>
            ))}
          </div>

          {pick.meta.source === "editorial_reserve" ? (
            <div className="mt-5 rounded-[1.25rem] border border-[var(--line-strong)] bg-[var(--panel-muted)] px-4 py-3 text-sm leading-7 text-[var(--ink-dim)]">
              TMDB is unavailable right now. The reserve shelf still gives you workable movie options, but streaming availability is currently unknown.
            </div>
          ) : null}

          <div className="mt-5 md:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="inline-flex w-full items-center justify-between rounded-[1.2rem] border border-[var(--line-soft)] bg-[var(--surface-soft)] px-4 py-3 text-left text-sm font-medium text-[var(--ink-main)]"
              aria-expanded={filtersOpen}
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal size={16} /> More filters
              </span>
              <ChevronDown size={16} className={cn("transition", filtersOpen ? "rotate-180" : "")} />
            </button>
          </div>

          <div className={cn("mt-5 space-y-5", filtersOpen ? "block" : "hidden md:block")}>
            <div className="grid gap-4 md:grid-cols-2">
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
              <label className="space-y-2 text-sm text-[var(--ink-main)] md:col-span-2">
                <span>Vibe</span>
                <SelectField value={filters.vibe} onChange={(event) => setFilters((current) => ({ ...current, vibe: event.target.value as typeof current.vibe }))}>
                  {vibeOptions.map((vibe) => (
                    <option key={vibe.value} value={vibe.value}>{vibe.label}</option>
                  ))}
                </SelectField>
              </label>
            </div>

            <div className="space-y-3">
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

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--ink-main)]">Services</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Optional</p>
              </div>
              {providerCatalog.source === "unavailable" ? (
                <p className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--panel-muted)] px-4 py-3 text-sm text-[var(--ink-dim)]">
                  Provider filters are offline right now, so service-specific narrowing is temporarily unavailable.
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

          {status ? <p className="mt-4 text-sm text-[var(--ink-dim)]">{status}</p> : null}
        </article>
      </div>
    </section>
  );
}
