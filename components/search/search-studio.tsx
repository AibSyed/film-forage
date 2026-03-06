"use client";

import type { Route } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Search, Trash2 } from "lucide-react";
import type { SearchResponseVM } from "@/features/picker/contracts";
import { launchRegions } from "@/features/picker/contracts";
import { getSearchFallbackMessage } from "@/features/picker/presentation";
import {
  addRecentSearch,
  clearRecentSearches,
  createWorkspaceDefaults,
  readWorkspace,
  subscribeToWorkspace,
} from "@/features/workspace/storage";
import { MovieCard } from "@/components/movie/movie-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";

export function SearchStudio({
  initialQuery,
  initialRegion,
  initialResults,
}: {
  initialQuery: string;
  initialRegion: string;
  initialResults: SearchResponseVM | null;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState(initialRegion);
  const [recentSearches, setRecentSearches] = useState(() => readWorkspace().recentSearches ?? createWorkspaceDefaults().recentSearches);

  useEffect(() => {
    if (initialQuery.trim().length >= 2) {
      addRecentSearch(initialQuery);
    }
    return subscribeToWorkspace(() => setRecentSearches(readWorkspace().recentSearches));
  }, [initialQuery]);

  function runSearch() {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }
    addRecentSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}&region=${region}` as Route);
  }

  return (
    <section className="space-y-6">
      <article className="rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-6">
        <form
          className="grid gap-3 xl:grid-cols-[1fr_220px_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            runSearch();
          }}
        >
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Title search</span>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by movie title" />
          </label>
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Region</span>
            <SelectField value={region} onChange={(event) => setRegion(event.target.value)}>
              {launchRegions.map((option) => (
                <option key={option.code} value={option.code}>{option.label}</option>
              ))}
            </SelectField>
          </label>
          <div className="flex items-end">
            <Button className="w-full md:w-auto" type="submit" disabled={query.trim().length < 2}>
              <Search size={16} /> Search
            </Button>
          </div>
        </form>

        {recentSearches.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--line-soft)] pt-4">
            <p className="inline-flex items-center gap-2 text-sm text-[var(--ink-dim)]">
              <Clock3 size={15} /> Recent
            </p>
            {recentSearches.slice(0, 6).map((entry) => (
              <button
                key={`${entry.query}-${entry.at}`}
                type="button"
                onClick={() => {
                  setQuery(entry.query);
                  router.push(`/search?q=${encodeURIComponent(entry.query)}&region=${region}` as Route);
                }}
                className="rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--ink-main)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink-strong)]"
              >
                {entry.query}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecentSearches}
              className="ml-auto inline-flex items-center gap-2 text-sm text-[var(--ink-dim)] hover:text-[var(--ink-main)]"
            >
              <Trash2 size={15} /> Clear
            </button>
          </div>
        ) : null}
      </article>

      {initialQuery.length >= 2 && initialResults ? (
        <section className="space-y-4">
          {initialResults.meta.source === "editorial_reserve" ? (
            <div className="rounded-[1.75rem] border border-[var(--line-soft)] bg-[var(--panel-muted)] p-4 text-sm leading-7 text-[var(--ink-dim)]">
              {getSearchFallbackMessage()}
            </div>
          ) : null}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl text-[var(--ink-strong)]">Search results</h2>
              <p className="text-sm text-[var(--ink-dim)]">{initialResults.items.length} title{initialResults.items.length === 1 ? "" : "s"} found for &quot;{initialResults.query}&quot;.</p>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-muted)]">Direct title search</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {initialResults.items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} compact />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-8 text-sm leading-7 text-[var(--ink-dim)]">
          Search when you already have a title in mind and want details, streaming options, or a quick save.
        </section>
      )}
    </section>
  );
}
