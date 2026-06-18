import type { MealData } from "@/shared/CardCarousel";
import { router } from "expo-router";

export const navigateToProduct = (productId: number) => {
  router.push({
    pathname: "/(recipe)/product",
    params: { productId: productId.toString() },
  });
};

export const handleProductCardPress = (item: MealData) => {
  if (item.productId) {
    navigateToProduct(item.productId);
  }
};
