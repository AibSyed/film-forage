import { z } from "zod";
import { movieMatchCardSchema, regionSchema } from "@/features/picker/contracts";

export const savedMovieSchema = movieMatchCardSchema.extend({
  note: z.string().max(500).default(""),
  savedAt: z.string().datetime(),
  dismissed: z.boolean().default(false),
});

const recentSearchSchema = z.object({
  query: z.string().min(2).max(80),
  at: z.string().datetime(),
});

export const workspaceSchema = z.object({
  version: z.literal(4),
  region: regionSchema.default("US"),
  providerIds: z.array(z.number().int().positive()).default([]),
  savedMovies: z.array(savedMovieSchema).default([]),
  dismissedMovieIds: z.array(z.number().int().positive()).default([]),
  recentSearches: z.array(recentSearchSchema).max(10).default([]),
});

export type SavedMovieVM = z.infer<typeof savedMovieSchema>;
export type WorkspaceVM = z.infer<typeof workspaceSchema>;
