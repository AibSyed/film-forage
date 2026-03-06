import { PageShell } from "@/components/page-shell";
import { WatchlistExperience } from "@/components/watchlist/watchlist-experience";

export default function WatchlistPage() {
  return (
    <PageShell
      pathname="/watchlist"
      eyebrow="Local-first planning"
      title="Keep the picks that survive the first round."
      intro="This watchlist is for final contenders, private notes, and one clean export when you are ready to send a real plan."
    >
      <WatchlistExperience />
    </PageShell>
  );
}
