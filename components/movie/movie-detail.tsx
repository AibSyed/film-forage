import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { MovieDetailResponseVM } from "@/features/picker/contracts";
import { getSourceLabel } from "@/features/picker/presentation";
import { MovieActions } from "@/components/movie/movie-actions";

export function MovieDetail({ detail }: { detail: MovieDetailResponseVM }) {
  const movie = detail.movie;

  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-[2rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[24rem] bg-[linear-gradient(135deg,rgba(216,159,84,0.24),rgba(63,90,113,0.5))]">
            {movie.card.backdropUrl ? (
              <Image src={movie.card.backdropUrl} alt={`${movie.card.title} backdrop`} fill className="object-cover" priority sizes="(min-width: 1024px) 50vw, 100vw" />
            ) : null}
          </div>
          <div className="space-y-5 p-5 md:p-7">
            <p className="text-xs uppercase tracking-[0.13em] text-[var(--ink-muted)]">
              {getSourceLabel(detail.meta.source)} · {detail.meta.region}
              {movie.card.runtimeMinutes ? ` · ${movie.card.runtimeMinutes} min` : ""}
            </p>
            <div>
              <h2 className="font-display text-5xl leading-[0.96] text-[var(--ink-strong)] md:text-6xl">{movie.card.title}</h2>
              {movie.tagline ? <p className="mt-3 text-lg text-[var(--ink-dim)]">{movie.tagline}</p> : null}
            </div>
            <p className="text-[15px] leading-7 text-[var(--ink-main)]">{movie.card.overview}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent-ink)]">
              {movie.card.fitReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <p className="text-sm text-[var(--ink-dim)]">{movie.card.providerSummary.note}</p>
            <MovieActions movie={movie.card} />
            <div className="flex flex-wrap gap-3 text-sm text-[var(--ink-dim)]">
              {movie.releaseDate ? <p>Released {movie.releaseDate}</p> : null}
              {movie.spokenLanguages.length > 0 ? <p>Languages: {movie.spokenLanguages.slice(0, 3).join(", ")}</p> : null}
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-[var(--ink-main)]">
              {movie.trailerUrl ? <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--ink-strong)]">Watch trailer</a> : null}
              {movie.card.providerSummary.linkUrl ? <a href={movie.card.providerSummary.linkUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--ink-strong)]">Open provider list</a> : null}
              {movie.imdbUrl ? <a href={movie.imdbUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--ink-strong)]">Open IMDb</a> : null}
            </div>
          </div>
        </div>
      </article>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[1.75rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-5">
          <h3 className="font-display text-3xl text-[var(--ink-strong)]">Current data status</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">{movie.provenanceNote}</p>
          {movie.cast.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">Cast highlights</h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--ink-main)]">
                {movie.cast.map((person) => (
                  <li key={`${person.name}-${person.character ?? "none"}`}>{person.name}{person.character ? ` as ${person.character}` : ""}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>

        <article className="rounded-[1.75rem] border border-[var(--line-soft)] bg-[var(--surface-raised)] p-5">
          <h3 className="font-display text-3xl text-[var(--ink-strong)]">More titles in the same neighborhood</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[...movie.recommendations, ...movie.similar].slice(0, 6).map((entry) => (
              <Link key={`${entry.id}-${entry.title}`} href={`/movie/${entry.id}` as Route} className="rounded-[1.25rem] border border-[var(--line-soft)] bg-[var(--panel)] p-4 hover:border-[var(--line-strong)]">
                <p className="font-semibold text-[var(--ink-main)]">{entry.title}</p>
                <p className="mt-1 text-sm text-[var(--ink-dim)]">{entry.year}</p>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
