import { useAppSelector } from "@/api";
import { useMemo } from "react";

/**
 * Returns user's cheat meal settings (day of month + period).
 * Prefers profile from API, falls back to local storage.
 */
export function useCheatMealSettings() {
  const profile = useAppSelector((state) => state.user.profile);

  return useMemo(() => {
    const cheatMealDay = profile?.cheatMealDay;
    const periodOfDays = profile?.periodOfDays;
    const configured =
      Boolean(profile?.cheatMealDay && profile?.periodOfDays) ?? false;
    return { cheatMealDay, periodOfDays, configured };
  }, [profile?.cheatMealDay, profile?.periodOfDays]);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whether `date` falls on a scheduled cheat meal day (profile settings). */
export function isCheatMealDate(
  date: Date,
  cheatMealDay?: string | null,
  periodOfDays?: string | null
): boolean {
  if (!cheatMealDay || !periodOfDays) return false;

  const cheatDay = parseInt(cheatMealDay, 10) || 1;
  const period = parseInt(periodOfDays, 10) || 7;

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  let firstCheatDate = new Date(
    target.getFullYear(),
    target.getMonth(),
    cheatDay
  );

  if (firstCheatDate > target) {
    firstCheatDate = new Date(
      target.getFullYear(),
      target.getMonth() - 1,
      cheatDay
    );
  }

  firstCheatDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (target.getTime() - firstCheatDate.getTime()) / MS_PER_DAY
  );

  if (diffInDays < 0) return false;

  return diffInDays % period === 0;
}

/**
 * Returns true if today is a cheat meal day based on user settings.
 */
export function useIsCheatMealDay(): boolean {
  const profile = useAppSelector((state) => state.user.profile);

  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isCheatMealDate(
      today,
      profile?.cheatMealDay,
      profile?.periodOfDays
    );
  }, [profile?.cheatMealDay, profile?.periodOfDays]);
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

    return new Set(profileCheatMealIds ?? []);
    
  }, [isCheatMealDay, profileCheatMealIds]);
}
