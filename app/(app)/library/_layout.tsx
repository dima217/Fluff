import { Stack } from "expo-router";

export default function LibraryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="cheat-meal" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="note-create" />
    </Stack>
  );
}
