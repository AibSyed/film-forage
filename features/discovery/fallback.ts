import type { Movie } from "./schema";

export const fallbackMovies: Movie[] = [
  {
    id: "blade-runner-2049",
    title: "Blade Runner 2049",
    year: 2017,
    rating: 8.0,
    runtimeMinutes: 164,
    overview: "A memory-haunted blade runner uncovers a secret that threatens the remaining social order.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    mood: "atmospheric",
    genre: "sci-fi",
  },
  {
    id: "whiplash",
    title: "Whiplash",
    year: 2014,
    rating: 8.5,
    runtimeMinutes: 107,
    overview: "A rising drummer enters a brutal mentorship orbit where obsession and ambition collide.",
    posterUrl: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    mood: "intense",
    genre: "drama",
  },
  {
    id: "fantastic-mr-fox",
    title: "Fantastic Mr. Fox",
    year: 2009,
    rating: 7.9,
    runtimeMinutes: 87,
    overview: "A crafty fox risks everything for one last perfect caper and drags his community into chaos.",
    posterUrl: "https://image.tmdb.org/t/p/w500/e3aLTaD5ppxo3en0GAGceekEPAx.jpg",
    mood: "playful",
    genre: "animation",
  }
];
