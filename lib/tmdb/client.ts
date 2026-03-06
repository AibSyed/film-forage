import { z } from "zod";

export class TmdbUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TmdbUnavailableError";
  }
}

function ensureToken() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new TmdbUnavailableError("TMDB_ACCESS_TOKEN is not configured");
  }
  return token;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const baseUrl = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
  const url = new URL(path, `${baseUrl}/`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function requestTmdb<T>(
  path: string,
  schema: z.ZodType<T>,
  options?: {
    params?: Record<string, string | number | undefined>;
    revalidate?: number;
    timeoutMs?: number;
  }
): Promise<T> {
  const token = ensureToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 5000);

  try {
    const response = await fetch(buildUrl(path, options?.params), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: options?.revalidate ?? 900 },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new TmdbUnavailableError(`TMDB request failed with status ${response.status}`);
    }

    return schema.parse(await response.json());
  } catch (error) {
    if (error instanceof TmdbUnavailableError) {
      throw error;
    }

    throw new TmdbUnavailableError(error instanceof Error ? error.message : "TMDB request failed");
  } finally {
    clearTimeout(timeout);
  }
}
