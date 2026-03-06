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

function ProviderRow({ movie }: { movie: MovieMatchCardVM }) {
  const included = movie.providerSummary.included.slice(0, 4);
  const rent = movie.providerSummary.rent.slice(0, 2);

  if (movie.providerSummary.status === "unknown") {
    return <p className="text-sm text-[var(--ink-muted)]">{movie.providerSummary.note}</p>;
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

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-[1.75rem] border border-[var(--line-soft)] bg-white/92 shadow-[0_20px_60px_rgba(44,33,20,0.10)]"
    >
      <div className={compact ? "grid gap-0 md:grid-cols-[180px_1fr]" : "grid gap-0 lg:grid-cols-[240px_1fr]"}>
        <div className="relative min-h-56 bg-[linear-gradient(135deg,#d9c6a5,#9faec7)]">
          {movie.posterUrl ? (
            <Image src={movie.posterUrl} alt={`${movie.title} poster`} fill className="object-cover" sizes={compact ? "180px" : "240px"} />
          ) : (
            <div className="flex h-full items-end p-5 text-sm uppercase tracking-[0.24em] text-white/90">Poster unavailable</div>
          )}
        </div>
        <div className="flex flex-col gap-4 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge>{getSourceLabel(movie.provenance)}</Badge>
                <Badge>{movie.year}</Badge>
                {movie.runtimeMinutes ? <Badge>{movie.runtimeMinutes} min</Badge> : null}
              </div>
              <h2 className="font-display text-3xl leading-tight text-[var(--ink-strong)] md:text-4xl">{movie.title}</h2>
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
            {movie.fitReasons.map((reason) => (
              <Badge key={reason} className="border-[var(--accent-muted)] bg-[var(--accent-pale)] text-[var(--ink-main)]">{reason}</Badge>
            ))}
          </div>

          <ProviderRow movie={movie} />

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
