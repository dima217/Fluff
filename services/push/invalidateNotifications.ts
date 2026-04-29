import { authApi } from "@/api";
import { store } from "@/api/store";

export const invalidateNotifications = () => {
  store.dispatch(authApi.util.invalidateTags(["Notification"]));
};