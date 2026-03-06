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
      title="Already have a title in mind?"
      intro="Use Search when the question is not what to watch in general, but whether one specific movie is worth tonight."
    >
      <SearchStudio initialQuery={query} initialRegion={region} initialResults={initialResults} />
    </PageShell>
  );
}
