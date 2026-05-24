import { ProfileResponse } from "@/api/types";
import { getAge } from "@/services/equation/age";
import { BiometryFormData } from "@/widgets/Profile/wrappers/BiometryFormWrapper";

export function mapProfileToBiometryFormData(
  profile?: ProfileResponse | null
): Partial<BiometryFormData> {
  if (!profile) {
    return {
      sex: null,
      age: "18",
      height: "170",
      weight: "70",
    };
  }

  const age = getAge(profile.birthDate);

  return {
    sex: profile.gender ?? null,
    age: age > 0 ? String(age) : "18",
    height:
      profile.height != null ? String(Math.round(profile.height)) : "170",
    weight:
      profile.weight != null ? String(Math.round(profile.weight)) : "70",
  };
}
