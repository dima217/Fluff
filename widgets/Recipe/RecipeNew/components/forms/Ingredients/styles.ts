import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";
import { createFormStepStyles } from "@/widgets/Recipe/RecipeNew/styles/formStepStyles";

export const createIngredientsStyles = (colors: AppColors) =>
  StyleSheet.create({
    ...createFormStepStyles(colors),
    searchTrigger: { marginTop: 0, marginBottom: 0 },
  });

export type IngredientsStyles = ReturnType<typeof createIngredientsStyles>;
