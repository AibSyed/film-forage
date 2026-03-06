import { PageShell } from "@/components/page-shell";
import { SearchStudio } from "@/components/search/search-studio";
import { regionSchema } from "@/features/picker/contracts";
import { searchMovies } from "@/lib/tmdb/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const region = regionSchema.parse(params.region ?? "US");
  const initialResults = query.length >= 2 ? await searchMovies({ query, region }) : null;

  return (
    <PageShell
      pathname="/search"
      eyebrow="Direct lookup"
      title="Search the title when you already know the neighborhood."
      intro="Use this route when the decision problem is not what to watch, but whether a specific movie is the right fit tonight."
    >
      <SearchStudio initialQuery={query} initialRegion={region} initialResults={initialResults} />
    </PageShell>
  );
}
