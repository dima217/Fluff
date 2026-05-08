import { store } from "@/api/store";
import { Colors } from "@/constants/design-tokens";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { DragProvider } from "@/providers/DragProvider";
import { PushNotificationsController } from "@/providers/PushNotificationsController";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MMKV } from "react-native-mmkv";
import "react-native-reanimated";
import { Provider } from "react-redux";

const storage = new MMKV();

export default function RootLayout() {
  /* const isFirstLaunch = storage.getBoolean('hasLaunch') ?? true;
  
  if (isFirstLaunch) {
    storage.set('hasLaunch', true);
    return (
      <Stack>
        <Stack.Screen
          name="onboarding"
          options={{headerShown: false}}
        />
      </Stack>
    );
  } */

  return (
    <Provider store={store}>
      <PushNotificationsController />
      <LocalizationProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <DragProvider>
              <Stack
                screenOptions={{
                  contentStyle: {
                    backgroundColor: Colors.background,
                  },
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(app)" />
                <Stack.Screen name="(search)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(recipe)" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="+not-found" />
              </Stack>

              <StatusBar style="auto" />
            </DragProvider>
          </GestureHandlerRootView>
        </AuthProvider>
      </LocalizationProvider>
    </Provider>
  );
}
