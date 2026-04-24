import { useGetMyRecipesQuery } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import MediaCarousel from "@/shared/MediaCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { searchStorage } from "@/utils/searchStorage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getRecipesAsMealData, getRecipesData } from "../utils/data";

const AllSection = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [lastVisitedIds, setLastVisitedIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      setLastVisitedIds(searchStorage.getLastVisited());
    }, [])
  );

  const { data: recipes, isLoading } = useGetMyRecipesQuery();

  const recipesData = useMemo(() => {
    return getRecipesData(recipes);
  }, [recipes]);

  const recipesAsMealData: MealData[] = useMemo(
    () =>
      Array.isArray(recipesData) && recipesData.length > 0
        ? getRecipesAsMealData(recipesData)
        : [],
    [recipesData]
  );

  return (
    <>
      <View style={styles.section}>
        <ThemedText type="s">
          {t("homeSections.previoslyWatched")}
        </ThemedText>
        {lastVisitedIds.length > 0 ? (
          <MediaCarousel
            recipeIds={lastVisitedIds}
            variant="short"
            onCardPress={(id) => {}}
          />
        ) : (
          <ThemedText type="xs" style={styles.emptyText}>
            Нет недавно просмотренных
          </ThemedText>
        )}
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
  emptyText: {
    opacity: 0.7,
  },
});

export default AllSection;
