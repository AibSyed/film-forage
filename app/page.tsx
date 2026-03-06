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
      eyebrow="Find tonight's movie"
      title="Find a movie to watch tonight."
      intro="Choose your region, streaming services, runtime, and mood. Film Forage gives you a short list that fits what you can actually watch."
      mode="home"
    >
      <TonightPicker initialPick={initialPick} initialProviders={initialProviders} />
    </PageShell>
  );
}
