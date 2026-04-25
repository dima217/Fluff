import { setProfile } from "@/api/slices/userSlice";
import type { AppDispatch } from "@/api/store";
import type { AuthResponse, ProfileResponse } from "@/api/types";

export async function completeGoogleAuthSession(
  dispatch: AppDispatch,
  data: AuthResponse,
  fetchProfile: () => Promise<ProfileResponse>,
  options?: { googleAccountEmail?: string | null }
): Promise<boolean> {
  void data;
  void options;

  const profile = await fetchProfile();

  dispatch(
    setProfile({
      ...profile,
    })
  );

  // Google user should stay in onboarding when base profile fields are not filled yet.
  const isProfileIncomplete =
    !profile.birthDate ||
    !profile.gender ||
    profile.height == null ||
    profile.weight == null;

  return isProfileIncomplete;
}
