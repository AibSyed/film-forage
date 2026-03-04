"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Sparkles } from "lucide-react";
import type { MovieCard } from "@/features/discovery/schema";

type ShortlistBoardProps = {
  list: MovieCard[];
  setList: (updater: (current: MovieCard[]) => MovieCard[]) => void;
};

function SortableItem({ movie }: { movie: MovieCard }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: movie.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-zinc-100">{movie.title}</p>
          <p className="text-xs text-zinc-400">{movie.genre} · {movie.year}</p>
          <p className="mt-1 text-xs text-amber-200">{movie.reason}</p>
        </div>
        <button type="button" aria-label="Reorder shortlist item" className="rounded-full border border-zinc-600 p-1 text-zinc-300" {...attributes} {...listeners}>
          <GripVertical size={14} />
        </button>
      </div>
    </li>
  );
}

export function ShortlistBoard({ list, setList }: ShortlistBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setList((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  return (
    <aside className="rounded-3xl border border-zinc-800 bg-zinc-950/85 p-5" aria-label="Saved shortlist">
      <h2 className="font-display text-2xl text-zinc-100">Noir Shortlist</h2>
      <p className="mt-2 text-sm text-zinc-400">Drag your picks into the order you want for tonight.</p>
      {list.length === 0 ? (
        <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-900/70 p-4 text-sm text-zinc-400">
          <p className="inline-flex items-center gap-2"><Sparkles size={14} /> Save films to build momentum.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={list.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <ul className="mt-4 space-y-2">
              {list.map((movie) => (
                <SortableItem key={movie.id} movie={movie} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </aside>
  );
}
