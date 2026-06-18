import type { RecipeResponse } from "@/api/types";
import type { RecipeData } from "@/constants/types";

export const mapRecipeToRecipeData = (recipe: RecipeResponse): RecipeData => {
  const steps =
    recipe.stepsConfig?.steps?.map((step, index) => {
      const imageResource = step.resources?.find((r) => r.type === "image");
      const imageUrl = imageResource?.source;

      return {
        id: index + 1,
        title: step.name || `Step ${index + 1}`,
        description: step.description,
        image: imageUrl ? { uri: imageUrl } : undefined,
      };
    }) || [];

  return {
    title: recipe.name,
    id: recipe.id,
    steps,
    userRating: recipe.userRating,
  };
};
