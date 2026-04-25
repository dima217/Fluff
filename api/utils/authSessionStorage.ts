import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "auth-session" });
const IS_AUTHENTICATED_KEY = "is_authenticated";

export function getPersistedIsAuthenticated(): boolean {
  return storage.getBoolean(IS_AUTHENTICATED_KEY) ?? false;
}

export function setPersistedIsAuthenticated(value: boolean): void {
  storage.set(IS_AUTHENTICATED_KEY, value);
}
