import { useGetRecipeByIdQuery, normalizeMediaUrl } from "@/api";
import { useMemo } from "react";
import { View } from "react-native";
import MediaItem from "./MediaItems";

type RecipeFetchCardProps = {
  recipeId: number;
  variant: "short" | "long";
  onPress: (recipeId: number, title: string, videoUrl: string | undefined) => void;
};

/**
 * Загружает рецепт по id и рендерит MediaItem. По нажатию вызывает onPress(id, title, videoUrl)
 * чтобы родитель (MediaCarousel) открыл модалку с видео.
 */
export default function RecipeFetchCard({
  recipeId,
  variant,
  onPress,
}: RecipeFetchCardProps) {
  const { data: recipe, isLoading } = useGetRecipeByIdQuery(recipeId, {
    skip: !recipeId,
  });

  const author = useMemo(() => {
    if (!recipe?.user) return "Fluff";
    const { firstName, lastName } = recipe.user;
    return [firstName, lastName].filter(Boolean).join(" ") || "Fluff";
  }, [recipe?.user]);

  const videoUrl = useMemo(
    () =>
      recipe?.promotionalVideo
        ? normalizeMediaUrl(recipe.promotionalVideo) ?? undefined
        : undefined,
    [recipe?.promotionalVideo]
  );

  if (isLoading || !recipe) {
    return <View style={{ width: variant === "long" ? 320 : 240, height: 144 }} />;
  }

  return (
    <MediaItem
      title={recipe.name}
      author={author}
      imageUrl={recipe.image?.cover || recipe.image?.preview || ""}
      videoUrl={videoUrl}
      onPress={() => onPress(recipeId, recipe.name, videoUrl)}
      variant={variant}
    />
  );
}
