"use client";

import type { MovieMatchCardVM } from "@/features/picker/contracts";
import { workspaceSchema, type WorkspaceVM } from "@/features/workspace/contracts";

const STORAGE_KEY = "film-forage:v4:workspace";
const EVENT_NAME = "film-forage:workspace-updated";

function defaultWorkspace(): WorkspaceVM {
  return workspaceSchema.parse({ version: 4 });
}

export function readWorkspace(): WorkspaceVM {
  if (typeof window === "undefined") {
    return defaultWorkspace();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultWorkspace();
    }

    return workspaceSchema.parse(JSON.parse(raw));
  } catch {
    return defaultWorkspace();
  }
}

function writeWorkspace(next: WorkspaceVM) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function subscribeToWorkspace(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = () => callback();
  window.addEventListener(EVENT_NAME, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
    window.removeEventListener("storage", listener);
  };
}

export function setRegionPreference(region: string) {
  const current = readWorkspace();
  writeWorkspace({ ...current, region });
}

export function setProviderPreference(providerIds: number[]) {
  const current = readWorkspace();
  writeWorkspace({ ...current, providerIds: providerIds.slice(0, 12) });
}

export function saveMovie(movie: MovieMatchCardVM, note = "") {
  const current = readWorkspace();
  const savedMovies = [
    { ...movie, note, savedAt: new Date().toISOString(), dismissed: false },
    ...current.savedMovies.filter((entry) => entry.id !== movie.id),
  ];

  writeWorkspace({ ...current, savedMovies });
}

export function updateMovieNote(id: number, note: string) {
  const current = readWorkspace();
  writeWorkspace({
    ...current,
    savedMovies: current.savedMovies.map((movie) => (movie.id === id ? { ...movie, note } : movie)),
  });
}

export function removeSavedMovie(id: number) {
  const current = readWorkspace();
  writeWorkspace({
    ...current,
    savedMovies: current.savedMovies.filter((movie) => movie.id !== id),
  });
}

export function dismissMovie(id: number) {
  const current = readWorkspace();
  if (current.dismissedMovieIds.includes(id)) {
    return;
  }

  writeWorkspace({
    ...current,
    dismissedMovieIds: [id, ...current.dismissedMovieIds].slice(0, 100),
  });
}

export function clearDismissedMovies() {
  const current = readWorkspace();
  writeWorkspace({ ...current, dismissedMovieIds: [] });
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return;
  }

  const current = readWorkspace();
  const recentSearches = [
    { query: trimmed, at: new Date().toISOString() },
    ...current.recentSearches.filter((entry) => entry.query.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, 10);

  writeWorkspace({ ...current, recentSearches });
}

export function clearWorkspace() {
  writeWorkspace(defaultWorkspace());
}
