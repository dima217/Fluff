// components/HomeContent.tsx
import {
  useAddToFavoritesMutation,
  useGetProductsQuery,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import MediaCarousel from "@/shared/MediaCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

interface HomeContentProps {
  selected: string;
}

const HomeContent = ({ selected }: HomeContentProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: products, isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  // Local state for optimistic updates
  const [localLikes, setLocalLikes] = useState<Record<number, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize local likes from products only once
  useEffect(() => {
    if (products && !isInitialized) {
      const initialLikes: Record<number, boolean> = {};
      products.forEach((product) => {
        initialLikes[product.id] = product.favorite;
      });
      setLocalLikes(initialLikes);
      setIsInitialized(true);
    }
  }, [products, isInitialized]);

  // Handle product like/unlike with optimistic update
  const handleProductLike = useCallback(
    async (productId: number, isLiked: boolean) => {
      // Optimistic update - immediately update local state
      const newLikedState = !isLiked;
      setLocalLikes((prev) => ({
        ...prev,
        [productId]: newLikedState,
      }));

      try {
        if (isLiked) {
          await removeFromFavorites({
            type: "product",
            id: productId,
          }).unwrap();
        } else {
          await addToFavorites({
            type: "product",
            id: productId,
          }).unwrap();
        }
      } catch (error) {
        // Revert on error
        console.error("Failed to toggle favorite:", error);
        setLocalLikes((prev) => ({
          ...prev,
          [productId]: isLiked, // Revert to original state
        }));
      }
    },
    [addToFavorites, removeFromFavorites]
  );

  const productsAsMealData: MealData[] = useMemo(
    () =>
      products
        ? products.map((product) => {
            // Use local state if it exists, otherwise use API data
            const isLiked =
              localLikes[product.id] !== undefined
                ? localLikes[product.id]
                : product.favorite;

            return {
              id: product.id.toString(),
              title: product.name,
              calories: `${product.calories} ккал / ${product.massa}г`,
              imageUrl: product.image?.cover || product.image?.preview || "",
              isLiked: isLiked,
              productId: product.id, // Store product ID for like handler
            };
          })
        : [],
    [products, localLikes]
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
            <CardsCarousel onCardPress={() => {}} variant="mealsToday" />
          </View>
          <View style={styles.section}>
            <ThemedText type="s">{t("homeSections.myRecipes")}</ThemedText>
            <CardsCarousel onCardPress={() => {}} variant="featured" />
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
              onCardPress={() => {}}
              onLikePress={(item) => {
                if (item.productId !== undefined) {
                  handleProductLike(item.productId, item.isLiked || false);
                }
              }}
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
              onCardPress={() => {
                router.push("/(recipe)/recipe");
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
