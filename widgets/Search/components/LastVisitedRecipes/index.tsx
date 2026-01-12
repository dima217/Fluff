import { useGetRecipesQuery } from "@/api";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { useMemo } from "react";

interface LastVisitedRecipesProps {
  recipeIds: number[];
  onCardPress: (item: MealData) => void;
}

const LastVisitedRecipes: React.FC<LastVisitedRecipesProps> = ({
  recipeIds,
  onCardPress,
}) => {
  // Get all recipes - RTK Query will cache them
  // We'll filter by last visited IDs
  const { data: recipesResponse } = useGetRecipesQuery();

  // Extract recipes array from API response: { data: [...], meta: {...} }
  const allRecipes = useMemo(() => {
    if (!recipesResponse) return [];
    if (typeof recipesResponse === "object" && "data" in recipesResponse) {
      return Array.isArray(recipesResponse.data) ? recipesResponse.data : [];
    }
    return Array.isArray(recipesResponse) ? recipesResponse : [];
  }, [recipesResponse]);

  // Filter and sort recipes by last visited order
  const lastVisitedMealData: MealData[] = useMemo(() => {
    if (!allRecipes || allRecipes.length === 0 || recipeIds.length === 0)
      return [];

    // Create a map for quick lookup
    const recipeMap = new Map(allRecipes.map((r) => [r.id, r]));

    // Get recipes in the order of last visited (preserve order from recipeIds)
    const recipes = recipeIds
      .map((id) => recipeMap.get(id))
      .filter((recipe) => recipe !== undefined);

    return recipes.map((recipe) => ({
      id: recipe.id.toString(),
      title: recipe.name,
      calories: `${recipe.calories} ккал`,
      imageUrl: recipe.image?.cover || recipe.image?.preview || "",
      isLiked: recipe.favorite,
      recipeId: recipe.id,
    }));
  }, [allRecipes, recipeIds]);

  if (lastVisitedMealData.length === 0) {
    return null;
  }

  return (
    <CardsCarousel
      products={lastVisitedMealData}
      onCardPress={onCardPress}
      variant="mealsToday"
    />
  );
};

export default LastVisitedRecipes;
