export function buildTmdbImageUrl(path: string | null | undefined, size: "w300" | "w500" | "w780" | "original" = "w500") {
  if (!path) {
    return undefined;
  }

  return `https://image.tmdb.org/t/p/${size}${path}`;
}
