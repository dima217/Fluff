import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/** Android: FCM registration token for DropHub backend (not Expo Push). */
export async function getNativeFcmToken(): Promise<string | null> {
  if (Platform.OS !== "android") {
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return null;
  }

  const devicePush = await Notifications.getDevicePushTokenAsync();
  if (devicePush.type === "android" && typeof devicePush.data === "string") {
    return devicePush.data;
  }
  return null;
}
