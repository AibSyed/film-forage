import { z } from "zod";

export class TmdbUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TmdbUnavailableError";
  }
}

type TmdbCredential =
  | { kind: "api_key"; value: string }
  | { kind: "bearer"; value: string };

export function resolveTmdbAuth(): TmdbCredential {
  const accessToken = process.env.TMDB_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();

  if (accessToken && !/^[a-f0-9]{32}$/i.test(accessToken)) {
    return { kind: "bearer", value: accessToken };
  }

  if (apiKey) {
    return { kind: "api_key", value: apiKey };
  }

  if (accessToken) {
    return { kind: "api_key", value: accessToken };
  }

  throw new TmdbUnavailableError("TMDB_ACCESS_TOKEN or TMDB_API_KEY is not configured");
}

function buildUrl(
  path: string,
  params: Record<string, string | number | undefined> | undefined,
  credential: TmdbCredential
) {
  const baseUrl = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
  const url = new URL(path, `${baseUrl}/`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  if (credential.kind === "api_key") {
    url.searchParams.set("api_key", credential.value);
  }

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
  const credential = resolveTmdbAuth();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 5000);

  try {
    const response = await fetch(buildUrl(path, options?.params, credential), {
      headers: credential.kind === "bearer"
        ? {
            Authorization: `Bearer ${credential.value}`,
            Accept: "application/json",
          }
        : {
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
