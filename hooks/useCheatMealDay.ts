import { cheatMealSettingsStorage } from "@/utils/cheatMealSettingsStorage";
import { cheatMealStorage } from "@/utils/cheatMealStorage";
import { useMemo } from "react";

/**
 * Returns user's cheat meal settings (day of month + period).
 * Reads from local storage (set after signup).
 */
export function useCheatMealSettings() {
  return useMemo(() => cheatMealSettingsStorage.get(), []);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REFERENCE_DATE = new Date(2026, 0, 1).getTime();

/**
 * Returns true if today is a cheat meal day based on user settings.
 * Logic: first cheat day = REFERENCE_DATE + (cheatMealDay - 1) days;
 * then every periodOfDays days. Today is cheat day if (daysSinceFirstCheat % periodOfDays) === 0.
 */
export function useIsCheatMealDay(): boolean {
  const settings = useCheatMealSettings();

  return useMemo(() => {
    const cheatDay = parseInt(settings.cheatMealDay, 10) || 1;
    console.log("cheatDay", cheatDay);
    const period = parseInt(settings.periodOfDays, 10) || 7;

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let firstCheatDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      cheatDay
    );

    if (firstCheatDate > today) {
      firstCheatDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        cheatDay
      );
    }

    firstCheatDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor(
      (today.getTime() - firstCheatDate.getTime()) / MS_PER_DAY
    );

    if (diffInDays < 0) return false;

    return diffInDays % period === 0;
  }, [settings.cheatMealDay, settings.periodOfDays]);
}


/**
 * When today is a cheat meal day, returns the set of recipe IDs that are in the user's cheat meal list.
 * Use this to exclude those recipes from the calorie tracker search on health screen so they don't appear there.
 * When today is not a cheat meal day, returns an empty set.
 */
export function useExcludeCheatMealRecipeIds(): Set<number> {
  const isCheatMealDay = useIsCheatMealDay();
  return useMemo(() => {
    console.log("isCheatMealDay", isCheatMealDay);
    if (isCheatMealDay) return new Set<number>();
    const items = cheatMealStorage.getAll();
    console.log("items", items);
    return new Set(items.map((item) => item.id));
  }, [isCheatMealDay]);
}
