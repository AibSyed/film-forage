"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import type { MovieMatchCardVM } from "@/features/picker/contracts";
import { getSourceLabel } from "@/features/picker/presentation";
import { MovieActions } from "@/components/movie/movie-actions";
import { Badge } from "@/components/ui/badge";

function getPosterMonogram(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ProviderRow({ movie }: { movie: MovieMatchCardVM }) {
  const included = movie.providerSummary.included.slice(0, 4);
  const rent = movie.providerSummary.rent.slice(0, 2);

  if (movie.providerSummary.status === "unknown") {
    return <p className="text-sm text-[var(--ink-dim)]">Availability is currently unknown for this title.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-[var(--ink-main)]">{movie.providerSummary.note}</p>
      <div className="flex flex-wrap gap-2">
        {included.map((provider) => (
          <Badge key={`included-${provider.id}`} className="bg-[var(--panel)] text-[var(--ink-main)]">{provider.name}</Badge>
        ))}
        {included.length === 0 && rent.map((provider) => (
          <Badge key={`rent-${provider.id}`} className="bg-[var(--panel)] text-[var(--ink-main)]">Rent: {provider.name}</Badge>
        ))}
      </div>
    </div>
  );
}

export function MovieCard({
  movie,
  compact = false,
  onDismissed,
}: {
  movie: MovieMatchCardVM;
  compact?: boolean;
  onDismissed?: (id: number) => void;
}) {
  const href = `/movie/${movie.id}` as Route;
  const fitReasons = compact ? movie.fitReasons.slice(0, 2) : movie.fitReasons.slice(0, 3);
  const monogram = getPosterMonogram(movie.title);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-[1.9rem] border border-[var(--line-soft)] bg-[linear-gradient(180deg,rgba(16,31,40,0.98),rgba(11,22,30,0.96))] shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
    >
      <div className={compact ? "grid grid-cols-[90px_1fr] gap-0 sm:grid-cols-[104px_1fr] xl:grid-cols-[120px_1fr]" : "grid grid-cols-[110px_1fr] gap-0 sm:grid-cols-[148px_1fr] lg:grid-cols-[188px_1fr]"}>
        <div className={compact ? "relative min-h-full bg-[linear-gradient(160deg,rgba(216,159,84,0.22),rgba(57,86,110,0.48))]" : "relative min-h-full bg-[linear-gradient(160deg,rgba(216,159,84,0.24),rgba(57,86,110,0.52))]"}>
          {movie.posterUrl ? (
            <Image src={movie.posterUrl} alt={`${movie.title} poster`} fill className="object-cover" sizes={compact ? "120px" : "188px"} />
          ) : (
            <div className={compact ? "flex h-full flex-col justify-between p-3" : "flex h-full flex-col justify-between p-4"}>
              <div className={compact ? "inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--line-soft)] bg-[rgba(6,18,25,0.28)] font-display text-sm text-[var(--ink-strong)]" : "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line-soft)] bg-[rgba(6,18,25,0.28)] font-display text-lg text-[var(--ink-strong)]"}>
                {monogram}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">Poster unavailable</p>
                <p className="text-xs leading-6 text-[var(--ink-soft)]">{movie.year}</p>
              </div>
            </div>
          )}
        </div>
        <div className={compact ? "flex flex-col gap-3 p-4 sm:p-5" : "flex flex-col gap-4 p-4 sm:p-5 lg:p-6"}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {movie.provenance !== "live_tmdb" ? <Badge>{getSourceLabel(movie.provenance)}</Badge> : null}
                <Badge>{movie.year}</Badge>
                {movie.runtimeMinutes ? <Badge>{movie.runtimeMinutes} min</Badge> : null}
              </div>
              <h2 className={compact ? "font-display text-[1.45rem] leading-[1.02] text-[var(--ink-strong)] sm:text-[1.7rem]" : "font-display text-[1.75rem] leading-[0.96] text-[var(--ink-strong)] md:text-[2.3rem]"}>{movie.title}</h2>
              <p className="text-sm text-[var(--ink-dim)]">{movie.genres.join(" · ")}</p>
            </div>
            {movie.voteAverage ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-2 text-sm text-[var(--ink-main)]">
                <Star size={15} className="text-[var(--accent-strong)]" /> {movie.voteAverage.toFixed(1)}
              </p>
            ) : null}
          </div>

          <p className="text-[15px] leading-7 text-[var(--ink-main)]">{movie.overview}</p>

          <div className="flex flex-wrap gap-2">
            {fitReasons.map((reason) => (
              <Badge key={reason} className="border-[var(--accent-muted)] bg-[var(--accent-pale)] text-[var(--ink-main)]">{reason}</Badge>
            ))}
          </div>

          <div className="rounded-[1.35rem] border border-[var(--line-soft)] bg-[rgba(6,18,25,0.34)] p-3">
            <ProviderRow movie={movie} />
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            <MovieActions movie={movie} onDismissed={onDismissed} />
            <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">
              Open full detail <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
