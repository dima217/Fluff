import type { RecipeResponse, TrackingResponse } from "@/api/types";

export interface NutrientAmount {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

const MACRO_SPLIT = {
  proteins: 0.3,
  fats: 0.25,
  carbs: 0.45,
} as const;

export function estimateMacrosFromCalories(calories: number): NutrientAmount {
  return {
    calories,
    proteins: (calories * MACRO_SPLIT.proteins) / 4,
    fats: (calories * MACRO_SPLIT.fats) / 9,
    carbs: (calories * MACRO_SPLIT.carbs) / 4,
  };
}

export function calculateNutrientProgress(consumed: number, norm: number): number {
  if (norm <= 0) return 0;
  return (consumed / norm) * 100;
}

function getRecordNutrients(
  record: TrackingResponse,
  recipe?: RecipeResponse,
): NutrientAmount {
  // Prefer macros stored directly on the tracking record (e.g. scaled portion or manual entry)
  if (record.proteins != null && record.fats != null && record.carbs != null) {
    return {
      calories: record.calories,
      proteins: record.proteins,
      fats: record.fats,
      carbs: record.carbs,
    };
  }

  if (recipe) {
    const calories = recipe.calories ?? record.calories;

    if (recipe.proteins != null && recipe.fats != null && recipe.carbs != null) {
      return {
        calories,
        proteins: recipe.proteins,
        fats: recipe.fats,
        carbs: recipe.carbs,
      };
    }

    return estimateMacrosFromCalories(calories);
  }

  return estimateMacrosFromCalories(record.calories);
}

export function calculateConsumedNutrients(
  records: TrackingResponse[],
  recipes: RecipeResponse[] = [],
): NutrientAmount {
  const recipesMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  return records.reduce<NutrientAmount>(
    (total, record) => {
      const recipe = record.recipeId ? recipesMap.get(record.recipeId) : undefined;
      const nutrients = getRecordNutrients(record, recipe);

      return {
        calories: total.calories + nutrients.calories,
        proteins: total.proteins + nutrients.proteins,
        fats: total.fats + nutrients.fats,
        carbs: total.carbs + nutrients.carbs,
      };
    },
    { calories: 0, proteins: 0, fats: 0, carbs: 0 },
  );
}
