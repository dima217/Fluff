import { useSearchRecipesQuery } from "@/api";
import type { RecipeResponse } from "@/api/types";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { searchStorage } from "@/storage/search/searchStorage";
import { normalizeApiArray } from "@/utils/normalizeApiArray";
import FilterTags from "@/widgets/Search/components/FilterTags";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

export const RECIPES_BY_PRODUCT_LIMIT = 10;

interface RecipeTag {
  label: string;
  recipeId: number;
}

interface PopularRecipesSectionProps {
  productId: number;
  limit?: number;
}

const PopularRecipesSection = ({
  productId,
  limit = RECIPES_BY_PRODUCT_LIMIT,
}: PopularRecipesSectionProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { data, isLoading } = useSearchRecipesQuery({
    productIds: [productId],
    page: 1,
    limit,
  });

  const recipes = useMemo(() => normalizeApiArray<RecipeResponse>(data), [data]);

  const recipeTags = useMemo((): RecipeTag[] => {
    return recipes.map((recipe) => ({
      label: `${recipe.name} · ${recipe.calories} ${t("health.caloriesUnit")}`,
      recipeId: recipe.id,
    }));
  }, [recipes, t]);

  if (isLoading) {
    return <ActivityIndicator style={{ paddingVertical: 16 }} />;
  }

  if (recipeTags.length === 0) return null;

  return (
    <View style={{ gap: 10 }}>
      <ThemedText type="body" weight="semibold">{t("homeSections.popularRecipes")}</ThemedText>
      <FilterTags
        filters={recipeTags.map((item) => item.label)}
        onTagPress={(label) => {
          const recipe = recipeTags.find((item) => item.label === label);
          if (!recipe) return;
          searchStorage.addToLastVisited(recipe.recipeId);
          router.push({
            pathname: "/(recipe)/recipe",
            params: { recipeId: recipe.recipeId.toString() },
          });
        }}
      />
    </View>
  );
};

export default PopularRecipesSection;
