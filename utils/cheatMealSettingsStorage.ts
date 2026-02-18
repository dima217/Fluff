import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const KEY = "user_cheat_meal_settings";

export interface CheatMealSettings {
  cheatMealDay: string; // 1-31
  periodOfDays: string; // e.g. "7"
  /** True when user set these in signup; used to show lock only for configured users */
  configured?: boolean;
}

const defaults: CheatMealSettings = {
  cheatMealDay: "1",
  periodOfDays: "7",
  configured: false,
};

export const cheatMealSettingsStorage = {
  get(): CheatMealSettings {
    try {
      const raw = storage.getString(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CheatMealSettings>;
        return { ...defaults, ...parsed };
      }
    } catch (e) {
      console.warn("cheatMealSettingsStorage.get error", e);
    }
    return { ...defaults };
  },

  set(settings: Partial<CheatMealSettings>): void {
    try {
      const current = this.get();
      storage.set(KEY, JSON.stringify({ ...current, ...settings }));
    } catch (e) {
      console.warn("cheatMealSettingsStorage.set error", e);
    }
  },
};
