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
      eyebrow="Screening concierge"
      title="Pick tonight's movie without the browsing spiral."
      intro="Set the region, narrow the runtime, optionally name your services, and get one strong live pick with honest backups instead of a decorative recommendation deck."
    >
      <TonightPicker initialPick={initialPick} initialProviders={initialProviders} />
    </PageShell>
  );
}
