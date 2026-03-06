import { PickerStudio } from "@/components/picker/picker-studio";
import { PageShell } from "@/components/page-shell";
import { defaultPickRequest } from "@/features/picker/defaults";
import { getProviderCatalog } from "@/lib/tmdb/providers";
import { pickMovies } from "@/lib/tmdb/picker";

export default async function HomePage() {
  const [initialPick, initialProviders] = await Promise.all([
    pickMovies(defaultPickRequest),
    getProviderCatalog(defaultPickRequest.region),
  ]);

  return (
    <PageShell
      pathname="/"
      eyebrow="Find your next movie"
      title="Find a movie worth watching."
      intro="Choose your region, streaming services, runtime, and mood. Film Forage turns that into a short list you can actually use."
      mode="home"
    >
      <PickerStudio initialPick={initialPick} initialProviders={initialProviders} />
    </PageShell>
  );
}
