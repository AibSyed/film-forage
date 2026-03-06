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
    return <p className="text-sm leading-6 text-[var(--ink-dim)]">Availability is currently unknown for this title.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm leading-6 text-[var(--ink-main)]">{movie.providerSummary.note}</p>
      <div className="flex flex-wrap gap-2">
        {included.map((provider) => (
          <Badge key={`included-${provider.id}`} className="bg-[var(--panel)] text-[var(--ink-main)]">
            {provider.name}
          </Badge>
        ))}
        {included.length === 0 &&
          rent.map((provider) => (
            <Badge key={`rent-${provider.id}`} className="bg-[var(--panel)] text-[var(--ink-main)]">
              Rent: {provider.name}
            </Badge>
          ))}
      </div>
    </div>
  );
}

function CompactProviderLine({ movie }: { movie: MovieMatchCardVM }) {
  if (movie.providerSummary.status === "unknown") {
    return <p className="text-sm text-[var(--ink-dim)]">Availability unknown</p>;
  }

  return <p className="line-clamp-1 text-sm text-[var(--ink-main)]">{movie.providerSummary.note}</p>;
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

  if (compact) {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-[1.45rem] border border-[var(--line-soft)] bg-[linear-gradient(180deg,rgba(15,24,34,0.98),rgba(10,16,24,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
      >
        <div className="grid grid-cols-[96px_1fr] gap-0">
          <div className="relative min-h-full bg-[linear-gradient(155deg,rgba(239,182,94,0.16),rgba(56,86,126,0.34))]">
            {movie.posterUrl ? (
              <Image src={movie.posterUrl} alt={`${movie.title} poster`} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="flex h-full flex-col justify-between p-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-[0.9rem] border border-[var(--line-soft)] bg-[rgba(7,12,18,0.44)] font-display text-sm text-[var(--ink-strong)]">
                  {monogram}
                </div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">No poster</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2.5 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-[1.35rem] leading-[1.02] text-[var(--ink-strong)]">{movie.title}</h2>
                <p className="text-xs text-[var(--ink-dim)]">
                  {movie.year}
                  {movie.runtimeMinutes ? ` • ${movie.runtimeMinutes} min` : ""}
                </p>
              </div>
              {movie.voteAverage ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ink-main)]">
                  <Star size={13} className="text-[var(--accent-strong)]" /> {movie.voteAverage.toFixed(1)}
                </span>
              ) : null}
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-[var(--ink-main)]">{movie.overview}</p>
            <div className="flex flex-wrap gap-2">
              {fitReasons.slice(0, 1).map((reason) => (
                <Badge key={reason} className="border-[var(--accent-muted)] bg-[var(--accent-pale)] text-[var(--ink-main)]">
                  {reason}
                </Badge>
              ))}
            </div>
            <CompactProviderLine movie={movie} />
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <MovieActions movie={movie} onDismissed={onDismissed} />
              <Link href={href} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-main)] hover:text-[var(--ink-strong)]">
                Detail <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-[1.7rem] border border-[var(--line-soft)] bg-[linear-gradient(180deg,rgba(15,24,34,0.98),rgba(10,16,24,0.98))] shadow-[0_22px_70px_rgba(0,0,0,0.24)]"
    >
      <div className="grid grid-cols-[132px_1fr] gap-0 sm:grid-cols-[220px_1fr]">
        <div className="relative min-h-full bg-[linear-gradient(155deg,rgba(239,182,94,0.16),rgba(56,86,126,0.34))]">
          {movie.posterUrl ? (
            <Image src={movie.posterUrl} alt={`${movie.title} poster`} fill className="object-cover" sizes={compact ? "140px" : "220px"} />
          ) : (
            <div className="flex h-full flex-col justify-between p-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[var(--line-soft)] bg-[rgba(7,12,18,0.44)] font-display text-lg text-[var(--ink-strong)]">
                {monogram}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">Poster unavailable</p>
                <p className="text-xs leading-6 text-[var(--ink-soft)]">{movie.year}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {movie.provenance !== "live_tmdb" ? <Badge>{getSourceLabel(movie.provenance)}</Badge> : null}
                <Badge>{movie.year}</Badge>
                {movie.runtimeMinutes ? <Badge>{movie.runtimeMinutes} min</Badge> : null}
              </div>
              <h2 className="font-display text-[2rem] leading-[0.96] text-[var(--ink-strong)] md:text-[2.6rem]">
                {movie.title}
              </h2>
              <p className="text-sm text-[var(--ink-dim)]">{movie.genres.join(" · ")}</p>
            </div>
            {movie.voteAverage ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-2 text-sm text-[var(--ink-main)]">
                <Star size={15} className="text-[var(--accent-strong)]" /> {movie.voteAverage.toFixed(1)}
              </p>
            ) : null}
          </div>

          <p className="line-clamp-4 text-[15px] leading-7 text-[var(--ink-main)]">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-2">
            {fitReasons.map((reason) => (
              <Badge key={reason} className="border-[var(--accent-muted)] bg-[var(--accent-pale)] text-[var(--ink-main)]">
                {reason}
              </Badge>
            ))}
          </div>

          <div className="rounded-[1.15rem] border border-[var(--line-soft)] bg-[rgba(7,12,18,0.36)] p-3">
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
