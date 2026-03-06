import { PageShell } from "@/components/page-shell";
import { WatchlistExperience } from "@/components/watchlist/watchlist-experience";

export default function WatchlistPage() {
  return (
    <PageShell
      pathname="/watchlist"
      eyebrow="Local-first planning"
      title="Keep your finalists close."
      intro="Use the watchlist to hold contenders, capture one private note, and export a clean shortlist when the group is ready."
    >
      <WatchlistExperience />
    </PageShell>
  );
}
