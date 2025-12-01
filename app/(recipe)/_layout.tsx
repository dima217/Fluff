// app/(recipe)/_layout.tsx
import { RecipeFormProvider } from "@/widgets/Recipe/RecipeNew/hooks/useRecipeFormContext";
import { Stack } from "expo-router";

export default function RecipeLayout() {
  return (
    <RecipeFormProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RecipeFormProvider>
  );
}
