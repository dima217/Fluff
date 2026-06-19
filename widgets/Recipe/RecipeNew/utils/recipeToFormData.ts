import type { RecipeResponse } from "@/api/types";
import type { CustomProduct, Recipe, SelectedProduct } from "@/constants/types";

/**
 * Преобразует ответ API рецепта в данные формы создания/редактирования.
 */
export function recipeResponseToFormData(recipe: RecipeResponse): Partial<Recipe> {
  const steps = (recipe.stepsConfig?.steps ?? []).map((step) => ({
    title: step.name,
    description: step.description,
    stepMediaUrl: step.resources?.[0]?.source ?? "",
  }));

  const selectedProducts: SelectedProduct[] = (recipe.products ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    grams: p.grams,
    unit: (p.unit as any) ?? undefined,
    calories: p.calories,
    image: p.image,
  }));

  const customProducts: CustomProduct[] = (recipe.customProducts ?? []).map((cp) =>
    typeof cp === "string"
      ? { name: cp }
      : {
          name: cp.name,
          grams: cp.grams,
          unit: (cp.unit as any) ?? undefined,
          calories: cp.calories,
          proteins: cp.proteins,
          fats: cp.fats,
          carbs: cp.carbs,
        }
  );

  return {
    name: recipe.name,
    ccal: recipe.calories,
    description: recipe.description ?? "",
    selectedProducts,
    customProducts,
    mediaUrl: recipe.image?.cover ?? recipe.image?.preview ?? "",
    videoUrl: recipe.promotionalVideo ?? "",
    steps: steps.length > 0 ? steps : [{ title: "", description: "", stepMediaUrl: "" }],
  };
}
