import type { ProductUnit } from "./types";

export const PRODUCT_UNITS: ProductUnit[] = ["г", "шт"];

export const DEFAULT_PRODUCT_UNIT: ProductUnit = "г";

export function getProductUnitLabel(
  unit: ProductUnit,
  t: (key: string) => string,
): string {
  return unit === "шт" ? t("recipe.pcsUnit") : t("recipe.gramsUnit");
}
