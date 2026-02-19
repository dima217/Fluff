import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const NOTES_KEY = "notes_list";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export const notesStorage = {
  getAll(): Note[] {
    try {
      const raw = storage.getString(NOTES_KEY);
      if (raw) return JSON.parse(raw) as Note[];
    } catch (e) {
      console.warn("notesStorage.getAll error", e);
    }
    return [];
  },

  add(note: Omit<Note, "id" | "createdAt">): Note {
    const list = this.getAll();
    const createdAt = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newNote: Note = { ...note, id, createdAt };
    try {
      storage.set(NOTES_KEY, JSON.stringify([newNote, ...list]));
    } catch (e) {
      console.warn("notesStorage.add error", e);
    }
    return newNote;
  },

  update(id: string, updates: Partial<Pick<Note, "title" | "content">>): void {
    const list = this.getAll();
    const index = list.findIndex((n) => n.id === id);
    if (index === -1) return;
    list[index] = { ...list[index], ...updates };
    try {
      storage.set(NOTES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("notesStorage.update error", e);
    }
  },

  remove(id: string): void {
    const list = this.getAll().filter((n) => n.id !== id);
    try {
      storage.set(NOTES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("notesStorage.remove error", e);
    }
  },

  getById(id: string): Note | undefined {
    return this.getAll().find((n) => n.id === id);
  },
};
