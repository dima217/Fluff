import { useGetRecipesQuery } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import MediaCarousel from "@/shared/MediaCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const AllSection = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: recipesResponse } = useGetRecipesQuery();

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
        <ThemedText type="s">
          {t("homeSections.previoslyWatched")}
        </ThemedText>
        <MediaCarousel onCardPress={() => {}} />
      </View>

      <View style={styles.section}>
        <ThemedText type="s">{t("homeSections.myRecipes")}</ThemedText>
        {recipesAsMealData.length > 0 ? (
          <CardsCarousel
            products={recipesAsMealData}
            onCardPress={(item) => {
              if (item.recipeId) {
                router.push({
                  pathname: "/(recipe)/recipe",
                  params: { recipeId: item.recipeId.toString() },
                });
              } else {
                router.push("/(recipe)/recipe");
              }
            }}
            variant="mealsToday"
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
});

export default AllSection;

