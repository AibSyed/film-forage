type SourceLabel = "live_tmdb" | "editorial_reserve";

export function getSourceLabel(source: SourceLabel) {
  return source === "live_tmdb" ? "Live TMDB" : "Reserve shelf";
}

export function getPickerStatusMessage(source: SourceLabel) {
  return source === "live_tmdb"
    ? "Film Forage refreshed."
    : "Live movie data is unavailable right now. Showing the reserve shelf instead.";
}

export function getProviderFallbackMessage() {
  return "Live provider filters are unavailable right now. You can still browse picks, but service availability may be unknown until TMDB returns.";
}

export function getSearchFallbackMessage() {
  return "Live title lookup is unavailable right now. These results come from the reserve shelf, so current service availability may be missing.";
}
