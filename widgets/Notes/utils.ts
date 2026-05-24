import { Note } from "@/utils/notesStorage";

export const getNoteItems = (
  notes: Note[],
  handlers: {
    onPress: (note: Note) => void;
    onDelete: (id: string) => void;
  },
  locale = "en-US"
) => {
  return notes.map((n) => ({
    id: n.id,
    title: n.title,
    createdAt: new Date(n.createdAt).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    onPress: () => handlers.onPress(n),
    onDelete: () => handlers.onDelete(n.id),
  }));
};
