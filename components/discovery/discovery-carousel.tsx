"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { BookmarkPlus } from "lucide-react";
import type { MovieCard } from "@/features/discovery/schema";
import { Button } from "@/components/primitives/button";

type DiscoveryCarouselProps = {
  items: MovieCard[];
  onSave: (item: MovieCard) => void;
};

const fallbackPoster =
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80";

function PosterImage({ item }: { item: MovieCard }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.posterUrl}
      alt={`${item.title} poster`}
      className="h-72 w-full object-cover"
      width={500}
      height={750}
      onError={(event) => {
        const target = event.currentTarget;
        if (target.src !== fallbackPoster) {
          target.src = fallbackPoster;
        }
      }}
    />
  );
}

export function DiscoveryCarousel({ items, onSave }: DiscoveryCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/70 p-5 text-zinc-400">
        No recommendations found for the current filter stack.
      </div>
    );
  }

  return (
    <div className="overflow-hidden" ref={emblaRef} aria-label="Discovery cards">
      <div className="flex gap-4">
        {items.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0 flex-[0_0_85%] rounded-3xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 shadow-noir md:flex-[0_0_54%]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-zinc-700">
              <PosterImage item={item} />
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-200">{item.mood} · confidence {(item.confidence * 100).toFixed(0)}%</p>
              <h3 className="font-display text-3xl text-zinc-100">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.year} · {item.runtimeMinutes} min · {item.genre}</p>
              <p className="text-zinc-200">{item.synopsis}</p>
              <p className="rounded-xl border border-zinc-700 bg-black/30 p-3 text-sm text-amber-100">Why this pick: {item.reason}</p>
              <Button className="gap-2" onClick={() => onSave(item)}>
                <BookmarkPlus size={16} /> Save to shortlist
              </Button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
