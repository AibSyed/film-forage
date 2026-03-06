export function getSourceLabel(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb" ? "Live TMDB" : "Reserve shelf";
}

export function getPickerStatusMessage(source: "live_tmdb" | "editorial_reserve") {
  return source === "live_tmdb"
    ? "Film Forage refreshed the shortlist."
    : "Live data is down right now, so Film Forage switched to the reserve shelf.";
}

export function getProviderFallbackMessage() {
  return "Provider filters are unavailable right now, so Film Forage is only using runtime and genre filters until live service data returns.";
}

export function getSearchFallbackMessage() {
  return "Live search is unavailable right now. These results come from the reserve shelf instead.";
}
