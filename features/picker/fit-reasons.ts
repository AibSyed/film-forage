import type { MovieMatchCardVM, PickRequestVM } from "@/features/picker/contracts";
import { getGenreLabel } from "@/features/picker/contracts";

function formatRegion(region: string) {
  return region.toUpperCase();
}

export function buildFitReasons(movie: Omit<MovieMatchCardVM, "fitReasons">, request: PickRequestVM) {
  const reasons: string[] = [];
  const normalizedGenres = movie.genres.map((genre) => genre.toLowerCase());
  const requestedGenre = getGenreLabel(request.genre).toLowerCase();

  if (movie.runtimeMinutes && movie.runtimeMinutes <= request.runtimeMax) {
    reasons.push(`Under ${request.runtimeMax} min`);
  }

  if (
    request.genre !== "any" &&
    (normalizedGenres.includes(requestedGenre) || (request.genre === "sci-fi" && normalizedGenres.includes("science fiction")))
  ) {
    reasons.push(`Matches ${getGenreLabel(request.genre)}`);
  }

  const providerNames = new Set(request.providers);
  const matchingIncluded = movie.providerSummary.included.filter((provider) => providerNames.has(provider.id));
  const matchingRent = movie.providerSummary.rent.filter((provider) => providerNames.has(provider.id));

  if (matchingIncluded.length > 0) {
    reasons.push(`Streaming on ${matchingIncluded[0]?.name} in ${formatRegion(request.region)}`);
  } else if (matchingRent.length > 0 && request.availabilityMode !== "subscription") {
    reasons.push(`Rentable on ${matchingRent[0]?.name} in ${formatRegion(request.region)}`);
  } else if (request.providers.length === 0 && movie.providerSummary.included.length > 0 && request.availabilityMode === "subscription") {
    reasons.push(`Included with subscription in ${formatRegion(request.region)}`);
  }

  if (movie.voteAverage && movie.voteAverage >= 7.5) {
    reasons.push(`Well-rated at ${movie.voteAverage.toFixed(1)}`);
  }

  if (reasons.length === 0) {
    reasons.push(`Released in ${movie.year}`);
  }

  return reasons.slice(0, 3);
}
