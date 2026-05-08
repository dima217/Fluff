import { useMemo } from "react";
import { CardsScrollVariant, MealData } from "..";
import { featuredRecipes, mealsToday } from "../mock";

export const useMealsData = (
  products?: MealData[],
  variant?: CardsScrollVariant,
  likes?: Record<string, boolean>
) => {
  return useMemo(() => {
    const base = variant === "featured" ? featuredRecipes : mealsToday;
    const final = products?.length ? products : base;

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
