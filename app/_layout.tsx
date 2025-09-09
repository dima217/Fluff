import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MMKV } from 'react-native-mmkv';
import 'react-native-reanimated';

const storage = new MMKV();

export default function RootLayout() {
  const isFirstLaunch = storage.getBoolean('hasLaunched') ?? true;
  
  if (isFirstLaunch) {
    storage.set('hasLaunched', true);
    return (
      <Stack>
        <Stack.Screen
          name="onBoarding"
          options={{headerShown: false}}
        />
      </Stack>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
