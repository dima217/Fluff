import type { RecipeResponse } from "@/api/types";

export const getRecipeAuthor = (recipe: RecipeResponse) => {
  if (recipe.isFluff) return "Fluff";
  if (recipe.user) return `${recipe.user.firstName} ${recipe.user.lastName}`;
  return "Unknown";
};
