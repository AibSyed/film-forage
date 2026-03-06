import { TonightPicker } from "@/components/picker/tonight-picker";
import { PageShell } from "@/components/page-shell";
import { defaultPickRequest } from "@/features/picker/defaults";
import { getProviderCatalog } from "@/lib/tmdb/providers";
import { pickTonight } from "@/lib/tmdb/picker";

export default async function HomePage() {
  const [initialPick, initialProviders] = await Promise.all([
    pickTonight(defaultPickRequest),
    getProviderCatalog(defaultPickRequest.region),
  ]);

  return (
    <PageShell
      pathname="/"
      eyebrow="Film Forage"
      title="Find the movie. Keep the shortlist."
      intro="Pick one strong lead, keep a few credible backups nearby, and verify where they stream before the room loses patience."
      mode="home"
    >
      <TonightPicker initialPick={initialPick} initialProviders={initialProviders} />
    </PageShell>
  );
}
