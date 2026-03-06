type SourceLabel = "live_tmdb" | "editorial_reserve";

export function getSourceLabel(source: SourceLabel) {
  return source === "live_tmdb" ? "Live TMDB" : "Forage reserve";
}

export function getPickerStatusMessage(source: SourceLabel) {
  return source === "live_tmdb"
    ? "Film Forage refreshed."
    : "Live movie data is unavailable right now. Film Forage is showing reserve picks instead.";
}

export function getProviderFallbackMessage() {
  return "Live provider filters are unavailable right now. You can still browse picks, but service availability may be unknown until TMDB returns.";
}

export function getSearchFallbackMessage() {
  return "Live title lookup is unavailable right now. These results come from Film Forage's reserve picks, so current service availability may be missing.";
}
