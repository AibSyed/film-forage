import { PageShell } from "@/components/page-shell";
import { SourceGuide } from "@/components/sources/source-guide";

export default function SourcesPage() {
  return (
    <PageShell
      pathname="/sources"
      eyebrow="Sources and limits"
      title="Know what comes from TMDB, and what does not."
      intro="This page explains live movie data, region-sensitive provider coverage, and what Film Forage shows when upstream data is unavailable."
    >
      <SourceGuide />
    </PageShell>
  );
}
