import type { ProviderSummaryVM } from "@/features/picker/contracts";
import { buildTmdbImageUrl } from "@/lib/tmdb/images";
import type { TmdbRegionalWatchProviders } from "@/lib/tmdb/schemas";

function mapProviders(entries: TmdbRegionalWatchProviders["flatrate"] = []) {
  return entries.map((provider) => ({
    id: provider.provider_id,
    name: provider.provider_name,
    logoUrl: buildTmdbImageUrl(provider.logo_path, "w300"),
  }));
}

export function buildProviderSummary(
  region: string,
  regional: TmdbRegionalWatchProviders | undefined
): ProviderSummaryVM {
  const included = mapProviders([...(regional?.flatrate ?? []), ...(regional?.free ?? []), ...(regional?.ads ?? [])]);
  const rent = mapProviders(regional?.rent ?? []);
  const buy = mapProviders(regional?.buy ?? []);

  const note = included.length > 0
    ? `Included with ${included.slice(0, 2).map((provider) => provider.name).join(", ")} in ${region}`
    : rent.length > 0
      ? `Rent on ${rent.slice(0, 2).map((provider) => provider.name).join(", ")} in ${region}`
      : buy.length > 0
        ? `Buy on ${buy.slice(0, 2).map((provider) => provider.name).join(", ")} in ${region}`
        : `Availability is not listed for ${region}`;

  return {
    region,
    included,
    rent,
    buy,
    note,
    linkUrl: regional?.link,
    status: regional ? "available" : "unknown",
  };
}
