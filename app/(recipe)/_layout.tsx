// app/(recipe)/_layout.tsx
import { RecipeFormProvider } from "@/widgets/Recipe/RecipeNew/hooks/useRecipeFormContext";
import { Stack } from "expo-router";

export default function RecipeLayout() {
  return (
    <RecipeFormProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="new-recipe"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="edit-recipe"
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack>
    </RecipeFormProvider>
  );
}
