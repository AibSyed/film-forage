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
      eyebrow="Search by title"
      title="Know the movie already?"
      intro="Search one title directly when you already have something in mind and just need to check the details."
    >
      <SearchStudio initialQuery={query} initialRegion={region} initialResults={initialResults} />
    </PageShell>
  );
}
