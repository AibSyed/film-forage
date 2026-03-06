import { beforeEach, describe, expect, it } from "vitest";
import {
  addRecentSearch,
  clearRecentSearches,
  dismissMovie,
  readWorkspace,
  saveMovie,
  updateMovieNote,
} from "@/features/workspace/storage";

const movie = {
  id: 42,
  title: "The Test",
  year: 2021,
  runtimeMinutes: 103,
  genres: ["Drama"],
  overview: "Overview",
  providerSummary: {
    region: "US",
    included: [],
    rent: [],
    buy: [],
    note: "Availability unknown",
    status: "unknown" as const,
  },
  fitReasons: ["Released in 2021"],
  voteAverage: 7.5,
  provenance: "editorial_reserve" as const,
};

describe("workspace storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores saved movies, notes, dismissed ids, and recent searches in the v4 workspace", () => {
    saveMovie(movie, "For Saturday.");
    updateMovieNote(42, "For after dinner.");
    dismissMovie(99);
    addRecentSearch("Arrival");

    const workspace = readWorkspace();

    expect(workspace.version).toBe(4);
    expect(workspace.savedMovies[0]?.note).toBe("For after dinner.");
    expect(workspace.dismissedMovieIds).toContain(99);
    expect(workspace.recentSearches[0]?.query).toBe("Arrival");
  });

  it("preserves an existing note when a saved movie is re-saved", () => {
    saveMovie(movie, "Keep this note.");
    saveMovie({ ...movie, voteAverage: 8.1 });

    const workspace = readWorkspace();
    expect(workspace.savedMovies[0]?.note).toBe("Keep this note.");
    expect(workspace.savedMovies[0]?.voteAverage).toBe(8.1);
  });

  it("can clear recent searches without touching saved movies", () => {
    saveMovie(movie, "Still here.");
    addRecentSearch("Arrival");
    clearRecentSearches();

    const workspace = readWorkspace();
    expect(workspace.savedMovies).toHaveLength(1);
    expect(workspace.recentSearches).toHaveLength(0);
  });
});
