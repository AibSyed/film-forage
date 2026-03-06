import { providerCatalogResponseSchema, type ProviderCatalogResponseVM } from "@/features/picker/contracts";
import { buildTmdbImageUrl } from "@/lib/tmdb/images";
import { requestTmdb, TmdbUnavailableError } from "@/lib/tmdb/client";
import { tmdbProviderCatalogSchema } from "@/lib/tmdb/schemas";

export async function getProviderCatalog(region: string): Promise<ProviderCatalogResponseVM> {
  try {
    const data = await requestTmdb("watch/providers/movie", tmdbProviderCatalogSchema, {
      params: { language: "en-US", watch_region: region },
      revalidate: 86400,
      timeoutMs: 4500,
    });

    return providerCatalogResponseSchema.parse({
      region,
      providers: data.results
        .sort((left, right) => left.display_priority - right.display_priority)
        .slice(0, 18)
        .map((provider) => ({
          id: provider.provider_id,
          name: provider.provider_name,
          displayPriority: provider.display_priority,
          logoUrl: buildTmdbImageUrl(provider.logo_path, "w300"),
        })),
      source: "live_tmdb",
    });
  } catch (error) {
    if (error instanceof TmdbUnavailableError) {
      return providerCatalogResponseSchema.parse({
        region,
        providers: [],
        source: "unavailable",
      });
    }

    throw error;
  }
}
