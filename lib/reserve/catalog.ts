import type { MovieMatchCardVM, PickRequestVM } from "@/features/picker/contracts";
import { buildFitReasons } from "@/features/picker/fit-reasons";

const reserveBase = [
  {
    id: 76341,
    title: "Mad Max: Fury Road",
    year: 2015,
    runtimeMinutes: 120,
    genres: ["Action", "Adventure", "Sci-Fi"],
    overview: "A desperate desert escape turns into a revolt against a violent regime.",
    voteAverage: 8.1,
  },
  {
    id: 329865,
    title: "Arrival",
    year: 2016,
    runtimeMinutes: 116,
    genres: ["Drama", "Sci-Fi", "Mystery"],
    overview: "A linguist is pulled into a first-contact crisis where language may prevent war.",
    voteAverage: 7.6,
  },
  {
    id: 324857,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    runtimeMinutes: 117,
    genres: ["Animation", "Action", "Adventure"],
    overview: "Miles Morales meets a multiverse of Spider-heroes and discovers his own voice.",
    voteAverage: 8.4,
  },
  {
    id: 546554,
    title: "Knives Out",
    year: 2019,
    runtimeMinutes: 131,
    genres: ["Comedy", "Crime", "Mystery"],
    overview: "A sharp-tongued detective investigates the death of a wealthy novelist.",
    voteAverage: 7.8,
  },
  {
    id: 27205,
    title: "Inception",
    year: 2010,
    runtimeMinutes: 148,
    genres: ["Action", "Sci-Fi", "Thriller"],
    overview: "A thief who steals secrets through dreams takes on a mission inside layered realities.",
    voteAverage: 8.4,
  },
] as const;

function baseCard(region: string, movie: (typeof reserveBase)[number]): Omit<MovieMatchCardVM, "fitReasons"> {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    runtimeMinutes: movie.runtimeMinutes,
    genres: [...movie.genres],
    overview: movie.overview,
    posterUrl: undefined,
    backdropUrl: undefined,
    providerSummary: {
      region,
      included: [],
      rent: [],
      buy: [],
      note: "Availability unknown while live movie data is unavailable.",
      status: "unknown",
      linkUrl: undefined,
    },
    voteAverage: movie.voteAverage,
    provenance: "editorial_reserve",
  };
}

export function getReserveCards(request: PickRequestVM): MovieMatchCardVM[] {
  const filtered = reserveBase
    .filter((movie) => !request.excludeIds.includes(movie.id))
    .filter((movie) => movie.runtimeMinutes <= request.runtimeMax)
    .filter((movie) => {
      if (request.genre === "any") {
        return true;
      }
      const genre = request.genre.toLowerCase();
      return movie.genres.some((entry) => {
        const normalized = entry.toLowerCase();
        return normalized === genre || (genre === "sci-fi" && normalized === "science fiction");
      });
    });

  return filtered.slice(0, 5).map((movie) => {
    const card = baseCard(request.region, movie);
    return {
      ...card,
      fitReasons: buildFitReasons(card, request),
    };
  });
}

export function searchReserveCards(query: string, region: string): MovieMatchCardVM[] {
  const normalizedQuery = query.trim().toLowerCase();

  return reserveBase
    .filter((movie) => movie.title.toLowerCase().includes(normalizedQuery))
    .slice(0, 8)
    .map((movie) => {
      const card = baseCard(region, movie);
      return {
        ...card,
        fitReasons: [`Reserve match for \"${query.trim()}\"`],
      };
    });
}

export function getReserveCardById(id: number, region: string): MovieMatchCardVM | null {
  const movie = reserveBase.find((entry) => entry.id === id);
  if (!movie) {
    return null;
  }

  const card = baseCard(region, movie);
  return {
    ...card,
    fitReasons: [`Reserve pick for ${region}`],
  };
}
