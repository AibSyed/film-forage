import type { SavedMovieVM } from "@/features/workspace/contracts";

export function buildWatchPlanText(movies: SavedMovieVM[]) {
  return movies
    .map((movie, index) => {
      const noteSuffix = movie.note ? ` - Note: ${movie.note}` : "";
      const availability = movie.providerSummary.note ? ` - ${movie.providerSummary.note}` : "";
      return `${index + 1}. ${movie.title} (${movie.year})${availability}${noteSuffix}`;
    })
    .join("\n");
}
