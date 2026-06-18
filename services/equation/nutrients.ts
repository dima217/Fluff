/**
 * Calculates daily macronutrient norms based on total daily calories.
 * Distribution: 30% protein · 25% fat · 45% carbs
 */
export interface DailyNutrientNorms {
  calories: number;
  proteins: number; // grams
  fats: number;     // grams
  carbs: number;    // grams
}

export function calculateDailyNutrients(dailyCalories: number): DailyNutrientNorms {
  return {
    calories: dailyCalories,
    proteins: Math.round((dailyCalories * 0.30) / 4),
    fats:     Math.round((dailyCalories * 0.25) / 9),
    carbs:    Math.round((dailyCalories * 0.45) / 4),
  };
}
