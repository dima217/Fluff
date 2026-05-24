import type { RecipeResponse } from "@/api/types";
import type { Recipe } from "@/constants/types";

/**
 * Преобразует ответ API рецепта в данные формы создания/редактирования.
 */
export function recipeResponseToFormData(recipe: RecipeResponse): Partial<Recipe> {
  const steps = (recipe.stepsConfig?.steps ?? []).map((step) => ({
    title: step.name,
    description: step.description,
    stepMediaUrl: step.resources?.[0]?.source ?? "",
  }));

  const ingredients =
    recipe.customProducts?.length
      ? recipe.customProducts.join(" ")
      : recipe.description ?? "";

  return {
    name: recipe.name,
    ccal: recipe.calories,
    ingredients,
    mediaUrl: recipe.image?.cover ?? recipe.image?.preview ?? "",
    videoUrl: recipe.promotionalVideo ?? "",
    steps: steps.length > 0 ? steps : [{ title: "", description: "", stepMediaUrl: "" }],
  };
}
