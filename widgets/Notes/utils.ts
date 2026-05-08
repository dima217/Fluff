import { Note } from "@/utils/notesStorage";

export const getNoteItems = (
  notes: Note[],
  handlers: {
    onPress: (note: Note) => void;
    onDelete: (id: string) => void;
  }
) => {
  return notes.map((n) => ({
    id: n.id,
    title: n.title,
    createdAt: new Date(n.createdAt).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    onPress: () => handlers.onPress(n),
    onDelete: () => handlers.onDelete(n.id),
  }));
};
