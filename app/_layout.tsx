import { store } from "@/api/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { ThemeProvider, useColors } from "@/contexts/ThemeContext";
import { DragProvider } from "@/providers/DragProvider";
import { PushNotificationsController } from "@/providers/PushNotificationsController";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";

function RootStack() {
  const colors = useColors();

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.background,
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
    </>
  );
}

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
        <ThemeProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <DragProvider>
                <RootStack />
              </DragProvider>
            </GestureHandlerRootView>
          </AuthProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}
