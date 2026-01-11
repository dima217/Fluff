import { Colors } from "@/constants/design-tokens";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MMKV } from "react-native-mmkv";
import { Provider } from "react-redux";
import { store } from "@/api/store";
import "react-native-reanimated";

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
      <LocalizationProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor: Colors.background,
                },
                presentation: "transparentModal",
                headerShown: false,
              }}
            >
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(search)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(recipe)" options={{ headerShown: false }} />

              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="notifications" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </AuthProvider>
      </LocalizationProvider>
    </Provider>
  );
}
