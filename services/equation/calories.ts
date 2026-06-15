import { calorieGoalStorage } from "@/storage/calorieGoal/calorieGoalStorage";

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  "0-1": 1.2,
  "1-3": 1.375,
  "3-5": 1.55,
  "5-7": 1.725,
  "7-9": 1.9,
  walking: 1.375,
  running: 1.55,
  cycling: 1.55,
  swimming: 1.55,
};

export function calculateDailyCalories({
  weight,
  height,
  age,
  gender,
  activity,
}: {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female" | "other";
  activity: string | null;
}): number | null {
  const calorieGoal = calorieGoalStorage.get();
  if (calorieGoal) {
    return Number(calorieGoal);
  }
  if (!weight || !height || !age) return null;

  let bmr: number;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 78;
  }

  const multiplier =
    ACTIVITY_MULTIPLIERS[(activity ?? "").toLowerCase()] ?? 1.2;
  const total = bmr * multiplier;

  return total > 0 ? Number(total.toFixed()) : null;
}

export function calculateDailyCaloriesRaw({
  weight,
  height,
  age,
  gender,
  activity,
}: {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female" | "other";
  activity: string | null;
}): number | null {
  if (!weight || !height || !age) return null;

  let bmr: number;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 78;
  }

  const multiplier =
    ACTIVITY_MULTIPLIERS[(activity ?? "").toLowerCase()] ?? 1.2;
  const total = bmr * multiplier;

  return total > 0 ? Number(total.toFixed()) : null;
}
