import { useAppSelector } from "@/api";
import { cheatMealSettingsStorage } from "@/utils/cheatMealSettingsStorage";
import { cheatMealStorage } from "@/utils/cheatMealStorage";
import { useMemo } from "react";

/**
 * Returns user's cheat meal settings (day of month + period).
 * Prefers profile from API, falls back to local storage.
 */
export function useCheatMealSettings() {
  const profile = useAppSelector((state) => state.user.profile);

  return useMemo(() => {
    const stored = cheatMealSettingsStorage.get();
    const cheatMealDay = profile?.cheatMealDay ?? stored.cheatMealDay;
    const periodOfDays = profile?.periodOfDays ?? stored.periodOfDays;
    const configured =
      Boolean(profile?.cheatMealDay && profile?.periodOfDays) ||
      stored.configured === true;

    return { cheatMealDay, periodOfDays, configured };
  }, [profile?.cheatMealDay, profile?.periodOfDays]);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns true if today is a cheat meal day based on user settings.
 */
export function useIsCheatMealDay(): boolean {
  const settings = useCheatMealSettings();

  return useMemo(() => {
    const cheatDay = parseInt(settings.cheatMealDay, 10) || 1;
    const period = parseInt(settings.periodOfDays, 10) || 7;

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
 * When today is not a cheat meal day, returns recipe IDs in the user's cheat meal list.
 */
export function useExcludeCheatMealRecipeIds(): Set<number> {
  const isCheatMealDay = useIsCheatMealDay();
  const profileCheatMealIds = useAppSelector(
    (state) => state.user.profile?.cheatMeal
  );

  return useMemo(() => {
    if (isCheatMealDay) return new Set<number>();

    if (profileCheatMealIds?.length) {
      return new Set(profileCheatMealIds);
    }

    const items = cheatMealStorage.getAll();
    return new Set(items.map((item) => item.id));
  }, [isCheatMealDay, profileCheatMealIds]);
}
