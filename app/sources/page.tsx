import { PageShell } from "@/components/page-shell";
import { SourceGuide } from "@/components/sources/source-guide";

export default function SourcesPage() {
  return (
    <PageShell
      pathname="/sources"
      eyebrow="Sources and limits"
      title="Know what is live, what is local, and what is reserve."
      intro="This page explains the app's live TMDB data, region-sensitive provider coverage, and what the reserve shelf means when upstream data is unavailable."
    >
      <SourceGuide />
    </PageShell>
  );
}
