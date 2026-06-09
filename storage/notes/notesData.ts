import { BaseStorage } from "../config";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

class NotesStorage extends BaseStorage<Note> {
  constructor() {
    super("notes_list");
  }

  add(note: Omit<Note, "id" | "createdAt">): Note {
    const list = this.getAll();
    const createdAt = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newNote: Note = { ...note, id, createdAt };

    this.setAll([newNote, ...list]);
    return newNote;
  }

  update(id: string, updates: Partial<Pick<Note, "title" | "content">>): void {
    const list = this.getAll();
    const index = list.findIndex((n) => n.id === id);

    if (index === -1) {
      return;
    }

    list[index] = { ...list[index], ...updates };
    this.setAll(list);
  }

  remove(id: string): void {
    this.setAll(this.getAll().filter((n) => n.id !== id));
  }

  getById(id: string): Note | undefined {
    return this.getAll().find((n) => n.id === id);
  }
}

export const notesStorage = new NotesStorage();
