"use client";

import type { Route } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { SearchResponseVM } from "@/features/picker/contracts";
import { launchRegions } from "@/features/picker/contracts";
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

  function runSearch() {
    if (query.trim().length < 2) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query.trim())}&region=${region}` as Route);
  }

  return (
    <section className="space-y-6">
      <article className="rounded-[1.75rem] border border-[var(--line-soft)] bg-white/92 p-5 shadow-[0_20px_60px_rgba(44,33,20,0.08)] md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
          <label className="space-y-2 text-sm text-[var(--ink-main)]">
            <span>Title lookup</span>
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
            <Button className="w-full md:w-auto" onClick={runSearch} disabled={query.trim().length < 2}>
              <Search size={16} /> Search
            </Button>
          </div>
        </div>
      </article>

      {initialQuery.length >= 2 && initialResults ? (
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-4xl text-[var(--ink-strong)]">Search results</h2>
            <p className="text-sm text-[var(--ink-dim)]">{initialResults.items.length} title{initialResults.items.length === 1 ? "" : "s"} found for &quot;{initialResults.query}&quot;.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {initialResults.items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} compact />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-8 text-sm text-[var(--ink-dim)]">
          Search a title when you know part of the answer already and just need a clean detail page, availability view, or a saveable fallback.
        </section>
      )}
    </section>
  );
}
