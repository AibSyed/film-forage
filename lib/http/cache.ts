export const SAFE_GET_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
} as const;

export const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
} as const;
