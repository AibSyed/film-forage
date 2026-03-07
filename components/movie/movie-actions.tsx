"use client";

import { useEffect, useState } from "react";
import { BookmarkPlus, BookmarkCheck, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { MovieMatchCardVM } from "@/features/picker/contracts";
import {
  dismissMovie,
  readWorkspace,
  saveMovie,
  subscribeToWorkspace,
} from "@/features/workspace/storage";
import { Button } from "@/components/ui/button";

export function MovieActions({ movie, onDismissed }: { movie: MovieMatchCardVM; onDismissed?: (id: number) => void }) {
  const [saved, setSaved] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function sync() {
      const workspace = readWorkspace();
      setSaved(workspace.savedMovies.some((entry) => entry.id === movie.id));
      setDismissed(workspace.dismissedMovieIds.includes(movie.id));
    }

    sync();
    return subscribeToWorkspace(sync);
  }, [movie.id]);

  if (dismissed) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={saved ? "secondary" : "primary"}
        size="sm"
        onClick={() => {
          saveMovie(movie);
          toast.success(`Saved "${movie.title}" to Watchlist.`);
        }}
        disabled={saved}
      >
        {saved ? <BookmarkCheck size={15} /> : <BookmarkPlus size={15} />}
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        variant="subtle"
        size="sm"
        onClick={() => {
          dismissMovie(movie.id);
          onDismissed?.(movie.id);
          toast("Hidden for now", {
            description: `"${movie.title}" will stay hidden until you reset hidden picks in Watchlist.`,
          });
        }}
      >
        <EyeOff size={15} /> Hide for now
      </Button>
    </div>
  );
}
