import { DiscoveryBoard } from "@/components/discovery-board";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-slate-50">
      <header className="mx-auto max-w-6xl px-6 pb-4 pt-10">
        <p className="text-sm uppercase tracking-[0.18em] text-sky-200">Film Forage 2.0</p>
        <h1 className="font-heading text-5xl leading-tight">Cinematic discovery tuned to your mood state.</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          We rebuilt Film Forage from scratch with typed contracts, resilient providers, and a swipe-ready recommendation board that blends curation and live discovery.
        </p>
      </header>
      <DiscoveryBoard />
    </main>
  );
}
