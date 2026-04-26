import { authApi } from "@/api/slices/authApi";
import { store } from "@/api/store";

export async function syncFcmTokenToBackend(token: string | null): Promise<void> {
  await store
    .dispatch(authApi.endpoints.setFcmToken.initiate({ token }))
    .unwrap();
}
