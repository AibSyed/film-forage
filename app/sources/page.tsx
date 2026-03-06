import { PageShell } from "@/components/page-shell";
import { SourceGuide } from "@/components/sources/source-guide";

export default function SourcesPage() {
  return (
    <PageShell
      pathname="/sources"
      eyebrow="Sources"
      title="See where the data comes from and where it can be incomplete."
      intro="This page explains live movie data, region-based provider coverage, and what Film Forage shows when live services are unavailable."
    >
      <SourceGuide />
    </PageShell>
  );
}
