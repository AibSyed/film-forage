import { PageShell } from "@/components/page-shell";
import { WatchlistExperience } from "@/components/watchlist/watchlist-experience";

export default function WatchlistPage() {
  return (
    <PageShell
      pathname="/watchlist"
      eyebrow="Watchlist"
      title="Keep the movies you still want to watch."
      intro="Save picks, add a private note, and copy a simple watchlist when it is time to choose."
    >
      <WatchlistExperience />
    </PageShell>
  );
}
