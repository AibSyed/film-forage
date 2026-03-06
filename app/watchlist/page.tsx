import { PageShell } from "@/components/page-shell";
import { WatchlistExperience } from "@/components/watchlist/watchlist-experience";

export default function WatchlistPage() {
  return (
    <PageShell
      pathname="/watchlist"
      eyebrow="Local watchlist"
      title="Keep the movies you might actually watch."
      intro="Save contenders, add one private note, and export a simple plan when it is time to pick."
    >
      <WatchlistExperience />
    </PageShell>
  );
}
