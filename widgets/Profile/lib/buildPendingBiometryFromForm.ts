import { calculateDailyCaloriesRaw } from "@/services/equation/calories";
import type { PendingBiometry } from "@/storage/pendingBiometry/pendingBiometryStorage";
import { BiometryFormData } from "@/widgets/Profile/wrappers/BiometryFormWrapper";

export function buildPendingBiometryFromForm(
  finalData: Partial<BiometryFormData>,
): PendingBiometry | null {
  if (
    !finalData.sex ||
    !finalData.age ||
    !finalData.height ||
    !finalData.weight
  ) {
    return null;
  }

  const birthDate = new Date();
  birthDate.setFullYear(birthDate.getFullYear() - parseInt(finalData.age, 10));

  const gender =
    finalData.sex === "male"
      ? "male"
      : finalData.sex === "female"
        ? "female"
        : "other";

  const height = parseFloat(finalData.height);
  const weight = parseFloat(finalData.weight);
  const age = parseInt(finalData.age, 10);

  const calculatedCalories = calculateDailyCaloriesRaw({
    weight,
    height,
    age,
    gender,
    activity: finalData.sportActivity ?? null,
  });

  if (!calculatedCalories) return null;

  return {
    gender,
    birthDate: birthDate.toISOString(),
    height,
    weight,
    sportActivity: finalData.sportActivity ?? undefined,
    calculatedCalories,
  };
}
