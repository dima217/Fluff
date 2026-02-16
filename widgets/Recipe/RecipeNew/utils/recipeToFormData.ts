import type { RecipeResponse } from "@/api/types";
import type { Recipe } from "@/constants/types";

/** Данные формы рецепта (включая поля шага Tutorial) */
export type RecipeFormData = Partial<Recipe> & {
  tutorialName?: string;
  tutorialDescription?: string;
};

/**
 * Преобразует ответ API рецепта в данные формы создания/редактирования.
 */
export function recipeResponseToFormData(recipe: RecipeResponse): RecipeFormData {
  const steps = (recipe.stepsConfig?.steps ?? []).map((step) => ({
    title: step.name,
    description: step.description,
    stepMediaUrl: step.resources?.[0]?.source ?? "",
  }));

  return {
    name: recipe.name,
    ccal: recipe.calories,
    ingredients: recipe.description ?? "",
    mediaUrl: recipe.image?.cover ?? recipe.image?.preview ?? "",
    videoUrl: recipe.promotionalVideo ?? "",
    steps: steps.length > 0 ? steps : [{ title: "", description: "", stepMediaUrl: "" }],
    tutorialName: recipe.name,
    tutorialDescription: recipe.description ?? "",
  };
}
