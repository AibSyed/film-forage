import { DiscoveryBoard } from "@/components/discovery-board";

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen text-slate-50">
      <header className="mx-auto max-w-6xl px-6 pb-4 pt-10">
        <p className="text-sm uppercase tracking-[0.18em] text-sky-200">Film Forage 2.0</p>
        <h1 className="font-heading text-5xl leading-tight">Cinematic discovery tuned to your mood state.</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Discover films with stronger pacing: intent filters, fast shortlist actions, and resilient fallback recommendations when live providers are unavailable.
        </p>
      </header>
      <DiscoveryBoard />
    </main>
  );
}
