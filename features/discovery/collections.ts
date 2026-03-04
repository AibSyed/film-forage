import type { MovieCard } from "@/features/discovery/schema";
import { curatedCatalog } from "@/features/discovery/catalog";

export type EditorialCollection = {
  slug: string;
  title: string;
  mood: MovieCard["mood"];
  description: string;
  curatorNote: string;
  ids: string[];
};

export const editorialCollections: EditorialCollection[] = [
  {
    slug: "midnight-propulsions",
    title: "Midnight Propulsions",
    mood: "adrenaline",
    description: "Fast pulse picks for late-night high-energy viewing sessions.",
    curatorNote: "Sequence these titles when you want immediate velocity and momentum.",
    ids: ["mad-max-fury-road", "spider-verse"],
  },
  {
    slug: "memory-cathedrals",
    title: "Memory Cathedrals",
    mood: "reflective",
    description: "Atmospheric stories with emotional residue and philosophical tension.",
    curatorNote: "Use this lane when you want stories that linger after credits.",
    ids: ["blade-runner-2049", "arrival", "prisoners"],
  },
  {
    slug: "kinetic-rebellion",
    title: "Kinetic Rebellion",
    mood: "playful",
    description: "Inventive form and kinetic visual language for creativity resets.",
    curatorNote: "Ideal for teams or solo watches where style and ideas need to collide.",
    ids: ["spider-verse", "mad-max-fury-road"],
  },
];

export function resolveCollection(slug: string) {
  const collection = editorialCollections.find((entry) => entry.slug === slug);
  if (!collection) {
    return null;
  }

  const items = collection.ids
    .map((id) => curatedCatalog.find((movie) => movie.id === id))
    .filter((item): item is MovieCard => Boolean(item));

  return {
    ...collection,
    items,
  };
}
