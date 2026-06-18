import {
  useGetRecipeByIdQuery,
  useMediaUrl,
} from "@/api";
import { useFavoriteToggle } from "@/api/hooks/useFavoriteToggle";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import View from "@/shared/View";
import { searchStorage } from "@/storage/search/searchStorage";
import DetailHero from "@/widgets/Recipe/RecipeInfo/components/DetailHero";
import DetailScreenState from "@/widgets/Recipe/RecipeInfo/components/DetailScreenState";
import IngredientsSection from "@/widgets/Recipe/RecipeInfo/components/IngredientsSection";
import NutritionSection from "@/widgets/Recipe/RecipeInfo/components/NutritionSection";
import RecipeCard from "@/widgets/Recipe/RecipeInfo/components/RecipeCard";
import { createDetailScreenStyles } from "@/widgets/Recipe/RecipeInfo/utils/detailScreenStyles";
import { formatCookTime } from "@/widgets/Recipe/RecipeInfo/utils/formatCookTime";
import { getRecipeAuthor } from "@/widgets/Recipe/RecipeInfo/utils/getRecipeAuthor";
import { mapRecipeToRecipeData } from "@/widgets/Recipe/RecipeInfo/utils/mapRecipeToRecipeData";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { ScrollView } from "react-native";

export default function RecipeScreen() {
  const colors = useColors();
  const styles = useThemedStyles(createDetailScreenStyles);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  const { toggleFavorite } = useFavoriteToggle();

  const recipeId = params.recipeId ? parseInt(params.recipeId as string, 10) : null;

  const { data: recipe, isLoading, error } = useGetRecipeByIdQuery(recipeId!, {
    skip: !recipeId,
  });

  useEffect(() => {
    if (recipeId) searchStorage.addToLastVisited(recipeId);
  }, [recipeId]);

  const { url: coverMediaUrl, headers: coverMediaHeaders } = useMediaUrl(
    recipe?.image?.cover,
    { skip: !recipe?.image?.cover },
  );

  const recipeData = useMemo(
    () => (recipe ? mapRecipeToRecipeData(recipe) : null),
    [recipe],
  );

  const navigateToSteps = useCallback(() => {
    if (!recipeData) return;
    router.push({
      pathname: "/recipe-steps",
      params: { data: JSON.stringify(recipeData) },
    });
  }, [recipeData, router]);

  const handleLike = useCallback(() => {
    if (!recipeId || !recipe) return;
    toggleFavorite({ id: recipeId, isFavorite: recipe.favorite, type: "recipe" });
  }, [recipe, recipeId, toggleFavorite]);

  if (isLoading) {
    return <DetailScreenState styles={styles} colors={colors} variant="loading" />;
  }

  if (error || !recipe || !recipeData) {
    return (
      <DetailScreenState
        styles={styles}
        colors={colors}
        variant="error"
        message={error ? t("recipe.loadError") : t("recipe.notFound")}
      />
    );
  }

  return (
    <ScrollView
      bounces={false}
      alwaysBounceVertical={false}
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <DetailHero
        coverUrl={coverMediaUrl}
        coverHeaders={coverMediaHeaders}
        fallbackUri={recipe.image?.cover}
        colors={colors}
        styles={styles}
      />

      <View style={styles.innerContainer}>
        <RecipeCard
          title={recipe.name}
          category={recipe.type?.name || "Recipe"}
          restaurant={getRecipeAuthor(recipe)}
          rating={recipe.average || 0}
          time={formatCookTime(recipe.cookAt)}
          calories={recipe.calories}
          description={recipe.description || ""}
          onLike={handleLike}
          isLiked={recipe.favorite ?? false}
          onMenu={() => {}}
          onPress={navigateToSteps}
        />

        <NutritionSection
          proteins={recipe.proteins}
          fats={recipe.fats}
          carbs={recipe.carbs}
          calories={recipe.calories}
        />

        <IngredientsSection
          products={recipe.products}
          customProducts={recipe.customProducts}
        />

        <Button title={t("recipe.cookIt")} onPress={navigateToSteps} />
      </View>
    </ScrollView>
  );
}
