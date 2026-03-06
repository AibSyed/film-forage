export function getSourceLabel(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb" ? "Live movie data" : "Fallback picks";
}

export function getPickerStatusMessage(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb"
    ? "Results updated."
    : "Live movie data is unavailable right now, so Film Forage switched to fallback picks.";
}

export function getProviderFallbackMessage() {
  return "Service filters are unavailable right now, so Film Forage is using runtime, genre, and mood until live provider data returns.";
}

export function getSearchFallbackMessage() {
  return "Live search is unavailable right now. These results come from fallback picks instead.";
}
