import type { ProfileResponse } from "@/api/types";
import { getAge } from "@/services/equation/age";
import { calculateDailyCaloriesRaw } from "@/services/equation/calories";

export function getCalculatedIntakeFromProfile(
  profile?: ProfileResponse | null,
): number | null {
  if (
    !profile?.weight ||
    !profile?.height ||
    !profile?.birthDate ||
    !profile?.gender
  ) {
    return null;
  }

  const age = getAge(profile.birthDate);
  if (age <= 0) return null;

  return calculateDailyCaloriesRaw({
    weight: Number(profile.weight),
    height: Number(profile.height),
    age,
    gender: profile.gender,
    activity: profile.sportActivity ?? null,
  });
}
