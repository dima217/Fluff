import * as Notifications from "expo-notifications";

import { syncFcmTokenToBackend } from "./syncFcmTokenToBackend";

export async function registerPushNotifications(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  const devicePush = await Notifications.getDevicePushTokenAsync();
  const token =
    typeof devicePush.data === "string" ? devicePush.data : null;

  if (!token) {
    return false;
  }

  await syncFcmTokenToBackend(token);
  return true;
}

export async function unregisterPushNotifications(): Promise<void> {
  await syncFcmTokenToBackend(null);
}
