import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const CHEAT_MEAL_KEY = "cheat_meal_recipes";

export interface CheatMealItem {
  id: number;
  name: string;
  calories: number;
  imageUrl: string;
  author: string;
}

export const cheatMealStorage = {
  getAll(): CheatMealItem[] {
    try {
      const raw = storage.getString(CHEAT_MEAL_KEY);
      if (raw) return JSON.parse(raw) as CheatMealItem[];
    } catch (e) {
      console.warn("cheatMealStorage.getAll error", e);
    }
    return [];
  },

  add(item: CheatMealItem): void {
    const list = this.getAll();
    if (list.some((x) => x.id === item.id)) return;
    try {
      storage.set(CHEAT_MEAL_KEY, JSON.stringify([...list, item]));
    } catch (e) {
      console.warn("cheatMealStorage.add error", e);
    }
  },

  remove(id: number): void {
    const list = this.getAll().filter((x) => x.id !== id);
    try {
      storage.set(CHEAT_MEAL_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("cheatMealStorage.remove error", e);
    }
  },

  has(id: number): boolean {
    return this.getAll().some((x) => x.id === id);
  },
};
