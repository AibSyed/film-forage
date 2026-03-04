import { describe, expect, it } from "vitest";
import { movieCollectionSchema } from "@/features/discovery/schema";

describe("movieCollectionSchema", () => {
  it("accepts valid movie collections", () => {
    const result = movieCollectionSchema.safeParse([
      {
        id: "movie-1",
        title: "Test Film",
        year: 2025,
        rating: 8.7,
        runtimeMinutes: 120,
        overview: "Story",
        posterUrl: "https://example.com/poster.jpg",
        mood: "focused",
        genre: "drama",
      },
    ]);

    expect(result.success).toBe(true);
  });

  it("rejects malformed external payloads", () => {
    const result = movieCollectionSchema.safeParse([{ id: 42, title: "bad" }]);
    expect(result.success).toBe(false);
  });
});
