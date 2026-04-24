import { ProductResponse, RecipeResponse } from "@/api/types";

export const getRecipesData = (recipesResponse: RecipeResponse[] | undefined) => {
    if (!recipesResponse) return [];
    if (typeof recipesResponse === "object" && "data" in recipesResponse) {
      return Array.isArray(recipesResponse.data) ? recipesResponse.data : [];
    }
    return Array.isArray(recipesResponse) ? recipesResponse : [];
};

export const getRecipesAsMealData = (recipesData: RecipeResponse[]) => {
    return recipesData.map((recipe) => ({
        id: recipe.id.toString(),
        title: recipe.name,
        calories: `${recipe.calories} ккал`,
        imageUrl: recipe.image?.cover || recipe.image?.preview || "",
        isLiked: recipe.favorite,
        recipeId: recipe.id,
    }));
};

export const getProductsAsMealData = (productsData: ProductResponse[]) => {
    return productsData.map((product) => ({
        id: product.id.toString(),
        title: product.name,
        calories: `${product.calories} ккал / ${product.massa}г`,
        imageUrl: product.image?.cover || product.image?.preview || "",
        isLiked: product.favorite,
        productId: product.id,
    }));
};

export const getProductsData = (productsResponse: ProductResponse[] | { data: ProductResponse[] } | undefined) => {
    if (!productsResponse) return [];
    if (typeof productsResponse === "object" && "data" in productsResponse) {
      return Array.isArray(productsResponse.data) ? productsResponse.data : [];
    }
    return Array.isArray(productsResponse) ? productsResponse : [];
};