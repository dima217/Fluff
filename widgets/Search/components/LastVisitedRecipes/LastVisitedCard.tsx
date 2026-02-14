import { useGetRecipeByIdQuery } from "@/api";
import type { MealData } from "@/shared/CardCarousel";
import MealCard from "@/shared/CardCarousel/Cards";
import { useMemo } from "react";
import { View } from "react-native";

interface LastVisitedCardProps {
  recipeId: number;
  onCardPress: (item: MealData) => void;
}

/**
 * Загружает один рецепт по id и рендерит карточку. Нужен отдельный компонент,
 * чтобы вызывать useGetRecipeByIdQuery(recipeId) для каждого id (список last visited
 * может содержать рецепты, которых нет в первой странице getRecipes).
 */
export default function LastVisitedCard({
  recipeId,
  onCardPress,
}: LastVisitedCardProps) {
  const { data: recipe, isLoading } = useGetRecipeByIdQuery(recipeId, {
    skip: !recipeId,
  });

  const mealData: MealData | null = useMemo(() => {
    if (!recipe) return null;
    return {
      id: recipe.id.toString(),
      title: recipe.name,
      calories: `${recipe.calories} ккал`,
      imageUrl: recipe.image?.cover || recipe.image?.preview || "",
      isLiked: recipe.favorite,
      recipeId: recipe.id,
    };
  }, [recipe]);

  if (isLoading || !mealData) {
    return <View style={{ width: 70, height: 70, marginRight: 15 }} />;
  }

  return (
    <MealCard
      title={mealData.title}
      calories={mealData.calories}
      imageUrl={mealData.imageUrl}
      variant="list"
      onPress={() => onCardPress(mealData)}
      isLiked={mealData.isLiked}
    />
  );
}
