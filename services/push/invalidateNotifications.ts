import { authApi } from "@/api";
import { achievementsApi } from "@/api/slices/achievementsApi";
import { store } from "@/api/store";

export const invalidateNotifications = () => {
  store.dispatch(authApi.util.invalidateTags(["Notification"]));
  store.dispatch(achievementsApi.util.invalidateTags(["Achievement"]));
};