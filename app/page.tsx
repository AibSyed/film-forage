import Link from "next/link";
import { DiscoveryExperience } from "@/components/discovery/discovery-experience";

export default function HomePage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8">
      <header className="grid gap-6 rounded-3xl border border-zinc-700 bg-black/40 p-6 shadow-noir md:p-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200">Neo-noir Discovery Engine</p>
          <h1 className="font-display text-6xl leading-[0.9] text-zinc-100 md:text-8xl">Find Tonight’s Cinematic Obsession</h1>
          <p className="max-w-2xl text-zinc-300">
            Film Forage is rebuilt as a premium editorial stage: mood-led surfacing, reasoned recommendations, drag-ranked shortlist flow, and resilient multi-source discovery.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-5 text-sm text-zinc-300">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Collections</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-zinc-100" href="/collections/midnight-propulsions">Midnight Propulsions</Link></li>
            <li><Link className="hover:text-zinc-100" href="/collections/memory-cathedrals">Memory Cathedrals</Link></li>
            <li><Link className="hover:text-zinc-100" href="/collections/kinetic-rebellion">Kinetic Rebellion</Link></li>
          </ul>
          <div className="mt-5 flex gap-3">
            <Link className="rounded-full border border-zinc-600 px-4 py-2 hover:border-zinc-400" href="/shortlist">Open shortlist</Link>
            <Link className="rounded-full border border-zinc-600 px-4 py-2 hover:border-zinc-400" href="/title/blade-runner-2049">Spotlight detail</Link>
          </div>
        </div>
      </header>
      <section className="mt-8">
        <DiscoveryExperience />
      </section>
    </main>
  );
}
