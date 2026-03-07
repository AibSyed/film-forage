export function getSourceLabel(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb" ? "Live TMDB snapshot" : "Film Forage reserve catalog";
}

export function getPickerStatusMessage(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb"
    ? "Results updated."
    : "Live movie data is unavailable right now, so Film Forage switched to reserve picks.";
}

export function getProviderFallbackMessage() {
  return "Service filters are unavailable right now, so Film Forage is using runtime, genre, and mood until live provider data returns.";
}

export function getSearchFallbackMessage() {
  return "Live search is unavailable right now. These results come from Film Forage reserve picks instead.";
}
