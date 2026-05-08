import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { useCallback, useEffect, useState } from "react";
import { MealData } from "..";

export const useMealLikes = (initialData: MealData[]) => {
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const [likes, setLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    initialData.forEach((item) => {
      const key = item.productId
        ? `product-${item.productId}`
        : item.recipeId
          ? `recipe-${item.recipeId}`
          : item.id;

      initial[key] = item.isLiked ?? false;
    });
    setLikes(initial);
  }, [initialData]);

  const toggleLike = useCallback(
    async (item: MealData) => {
      const key = item.productId
        ? `product-${item.productId}`
        : item.recipeId
          ? `recipe-${item.recipeId}`
          : item.id;

      const prev = likes[key] ?? false;

      setLikes((p) => ({ ...p, [key]: !prev }));

      try {
        const type = item.productId ? "product" : "recipe";
        const id = item.productId ?? item.recipeId;
        if (id == null) return;

        if (prev) {
          await removeFromFavorites({ type, id }).unwrap();
        } else {
          await addToFavorites({ type, id }).unwrap();
        }
      } catch {
        setLikes((p) => ({ ...p, [key]: prev }));
      }
    },
    [addToFavorites, likes, removeFromFavorites]
  );

  return { likes, toggleLike };
};
