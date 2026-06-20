import type { ProfileResponse } from "@/api/types";
import { getAge } from "@/services/equation/age";

const TRAINING_COUNT_TO_ACTIVITY_ID: Record<
  string,
  "sedentary" | "light" | "normal" | "regular" | "hard"
> = {
  "0-1": "sedentary",
  "1-3": "light",
  "3-5": "normal",
  "5-7": "regular",
  "7-9": "hard",
};

export function formatGenderLabel(
  gender: ProfileResponse["gender"],
  t: (key: string) => string,
): string {
  if (!gender) return "—";
  if (gender === "male") return t("signUp.male");
  if (gender === "female") return t("signUp.female");
  return t("profile.otherGender");
}

export function formatBirthDateWithAge(
  birthDate?: string | null,
): string {
  if (!birthDate) return "—";

  const date = new Date(birthDate);
  if (isNaN(date.getTime())) return "—";

  const age = getAge(birthDate);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const agePart = age > 0 ? ` (${age})` : "";

  return `${dd}.${mm}.${yyyy}${agePart}`;
}

export function formatHeightLabel(height?: number | null): string {
  if (height == null) return "—";
  return `${Math.round(height)} cm`;
}

export function formatWeightLabel(weight?: number | null): string {
  if (weight == null) return "—";
  return `${Math.round(weight)} kg`;
}

export function formatSportActivityLabel(
  sportActivity: string | undefined,
  t: (key: string) => string,
): string {
  if (!sportActivity) return "—";

  const activityId = TRAINING_COUNT_TO_ACTIVITY_ID[sportActivity];
  if (activityId) {
    return t(`signUp.sportActivities.${activityId}.label`);
  }

  return sportActivity;
}
