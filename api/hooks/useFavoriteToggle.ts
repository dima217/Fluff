import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "@/api";

type FavoriteType = "recipe" | "product";

interface ToggleFavoriteParams {
  id?: number;
  isFavorite?: boolean;
  type: FavoriteType;
}

export const useFavoriteToggle = () => {
  const [addToFavorites] = useAddToFavoritesMutation();

  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const toggleFavorite = async ({
    id,
    isFavorite,
    type,
  }: ToggleFavoriteParams) => {
    if (!id) return;

    try {
      if (isFavorite) {
        await removeFromFavorites({
          type,
          id,
        }).unwrap();
      } else {
        await addToFavorites({
          type,
          id,
        }).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return {
    toggleFavorite,
  };
};
