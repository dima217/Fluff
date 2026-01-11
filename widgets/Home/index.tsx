// components/HomeContent.tsx
import { useGetProductsQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import MediaCarousel from "@/shared/MediaCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface HomeContentProps {
  selected: string;
}

const HomeContent = ({ selected }: HomeContentProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: products, isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const productsAsMealData: MealData[] = useMemo(
    () =>
      products
        ? products.map((product) => ({
            id: product.id.toString(),
            title: product.name,
            calories: `${product.calories} ккал / ${product.massa}г`,
            imageUrl: product.image?.cover || product.image?.preview || "",
            isLiked: product.favorite,
            productId: product.id, // Store product ID for like handler
          }))
        : [],
    [products]
  );

  switch (selected) {
    case t("home.videos"):
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
            <MediaCarousel onCardPress={() => {}} />
          </View>
          <View style={styles.section}>
            <ThemedText type="s">
              {t("homeSections.recommendedRecipes")}
            </ThemedText>
            <MediaCarousel
              variant="long"
              onCardPress={() => {
                router.push("/(recipe)/recipe");
              }}
            />
          </View>
        </>
      );

    case t("home.recipes"):
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
            <CardsCarousel onCardPress={(item) => {}} variant="featured" />
          </View>
        </>
      );

    case t("home.caloriesBase"):
      return (
        <View style={styles.section}>
          <ThemedText type="s">{t("homeSections.mealsToday")}</ThemedText>
          {isLoadingProducts ? (
            <ThemedText type="xs">Загрузка...</ThemedText>
          ) : productsAsMealData.length > 0 ? (
            <CardsCarousel
              products={productsAsMealData}
              onCardPress={(item) => {}}
              variant="featured"
            />
          ) : (
            <ThemedText type="xs">Нет продуктов</ThemedText>
          )}
        </View>
      );

    case t("home.all"):
    default:
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
            <CardsCarousel
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
          </View>
        </>
      );
  }
};

export default HomeContent;

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
