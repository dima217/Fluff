import type { SelectedProduct } from "@/constants/types";

/**
 * Calculates total recipe calories from selected products.
 * - unit "г": (calories_per_100g * grams) / 100
 * - unit "шт" or no unit: calories_per_100g * quantity (1 if not specified)
 */
export function calcCaloriesFromProducts(products: SelectedProduct[]): number {
  if (!products || products.length === 0) return 0;

  const total = products.reduce((sum, p) => {
    const cal = p.calories ?? 0;
    const qty = p.grams ?? 1;
    const portion =
      p.unit === "шт" ? cal * qty : p.grams ? (cal * p.grams) / 100 : cal;
    return sum + portion;
  }, 0);

  return Math.round(total);
}
