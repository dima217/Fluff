import { useMemo } from "react";
import { CardsScrollVariant, MealData } from "..";

export const useMealsData = (
  products?: MealData[],
  variant?: CardsScrollVariant,
  likes?: Record<string, boolean>
) => {
  return useMemo(() => {
    const final = products ?? [];

    return final.map((item) => {
      const key = item.productId
        ? `product-${item.productId}`
        : item.recipeId
          ? `recipe-${item.recipeId}`
          : item.id;

      return {
        ...item,
        isLiked: likes?.[key] ?? item.isLiked ?? false,
      };
    });
  }, [products, variant, likes]);
};
