import { Colors } from "@/constants/design-tokens";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MMKV } from "react-native-mmkv";
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: Colors.background,
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="(search)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(recipe)" options={{ headerShown: false }} />

        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
