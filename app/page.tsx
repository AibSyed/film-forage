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
      eyebrow="Movie night, simplified"
      title="Find something worth watching, then stop scrolling."
      intro="Filter by runtime, mood, and streaming services, then keep the shortlist local while everyone decides."
      mode="home"
    >
      <TonightPicker initialPick={initialPick} initialProviders={initialProviders} />
    </PageShell>
  );
}
