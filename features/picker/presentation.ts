export function getSourceLabel(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb" ? "Live data" : "Fallback list";
}

export function getPickerStatusMessage(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb"
    ? "Results updated."
    : "Live movie data is unavailable right now, so Film Forage switched to the fallback list.";
}

export function getProviderFallbackMessage() {
  return "Service filters are unavailable right now, so Film Forage is only using runtime and genre until live provider data returns.";
}

export function getSearchFallbackMessage() {
  return "Live search is unavailable right now. These results come from the fallback list instead.";
}
