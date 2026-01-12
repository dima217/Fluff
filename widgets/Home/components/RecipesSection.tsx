import { useGetRecipesQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const RecipesSection = () => {
  const { t } = useTranslation();
  const { data: recipesResponse, isLoading: isLoadingRecipes } =
    useGetRecipesQuery();

  // Extract recipes array from API response: { data: [...], meta: {...} }
  const recipes = useMemo(() => {
    if (!recipesResponse) return [];
    if (typeof recipesResponse === "object" && "data" in recipesResponse) {
      return Array.isArray(recipesResponse.data) ? recipesResponse.data : [];
    }
    return Array.isArray(recipesResponse) ? recipesResponse : [];
  }, [recipesResponse]);

  const recipesAsMealData: MealData[] = useMemo(
    () =>
      Array.isArray(recipes) && recipes.length > 0
        ? recipes.map((recipe) => ({
            id: recipe.id.toString(),
            title: recipe.name,
            calories: `${recipe.calories} ккал`,
            imageUrl: recipe.image?.cover || recipe.image?.preview || "",
            isLiked: recipe.favorite,
            recipeId: recipe.id,
          }))
        : [],
    [recipes]
  );

  return (
    <>
      <View style={styles.section}>
        <View style={styles.allContainer}>
          <ThemedText type="s">
            {t("homeSections.previoslyWatched")}
          </ThemedText>
          <ThemedText type="xs" style={{ color: Colors.primary }}>
            {t("homeSections.seeAll")}
          </ThemedText>
        </View>
        <CardsCarousel onCardPress={(item) => {}} variant="mealsToday" />
      </View>
      <View style={styles.section}>
        <ThemedText type="s">{t("homeSections.myRecipes")}</ThemedText>
        {isLoadingRecipes ? (
          <ThemedText type="xs">Загрузка...</ThemedText>
        ) : recipesAsMealData.length > 0 ? (
          <CardsCarousel
            products={recipesAsMealData}
            onCardPress={(item) => {}}
            variant="featured"
          />
        ) : (
          <ThemedText type="xs">Нет рецептов</ThemedText>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 20,
    marginTop: "10%",
    alignSelf: "stretch",
  },
  allContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default RecipesSection;

