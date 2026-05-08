// components/HomeContent.tsx
import { useAppSelector } from "@/api";
import {
  useLazyGetFavoriteProductsQuery,
  useLazyGetFavoriteRecipesQuery,
} from "@/api/slices";
import { useTranslation } from "@/hooks/useTranslation";
import CardsCarousel from "@/shared/CardCarousel";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import {
  getProductsAsMealData,
  getRecipesAsMealData,
} from "@/widgets/Home/utils/data";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

interface HomeContentProps {
  selected: string;
}

const LibraryContent = ({ selected }: HomeContentProps) => {
  const { t } = useTranslation();

  const [
    getFavoriteRecipes,
    { data: recipesResponse, isLoading: isLoadingRecipes },
  ] = useLazyGetFavoriteRecipesQuery();
  const [
    getFavoriteProducts,
    { data: productsResponse, isLoading: isLoadingProducts },
  ] = useLazyGetFavoriteProductsQuery();

  const cheatMealIds = useAppSelector((state) => state.user.profile?.cheatMeal);

  useEffect(() => {
    if (selected === t("library.recipes")) {
      getFavoriteRecipes();
    } else if (selected === t("library.products")) {
      getFavoriteProducts();
    }
  }, [selected, t, getFavoriteRecipes, getFavoriteProducts]);

  switch (selected) {
    case t("library.recipes"):
      if (isLoadingRecipes) {
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" />
          </View>
        );
      }

      const filteredRecipes =
        recipesResponse?.filter(
          (product) => !cheatMealIds?.includes(product.id)
        ) || [];

      const recipesAsMealData = getRecipesAsMealData(filteredRecipes || []);

      return (
        <View style={styles.section}>
          <CardsCarousel
            products={recipesAsMealData}
            onCardPress={(item) => {
              router.push({
                pathname: "/(recipe)/recipe",
                params: { recipeId: item.recipeId?.toString() },
              });
            }}
            variant="featured"
            isDraggable
          />
        </View>
      );

    case t("library.products"):
      if (isLoadingProducts) {
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" />
          </View>
        );
      }

      const productsAsMealData = getProductsAsMealData(productsResponse || []);

      return (
        <View style={styles.section}>
          <CardsCarousel
            products={productsAsMealData}
            onCardPress={(item) => {}}
            variant="featured"
          />
        </View>
      );
  }
};

export default LibraryContent;

const styles = StyleSheet.create({
  section: {
    gap: 20,
    marginTop: "6%",
    alignSelf: "stretch",
  },
  loaderContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  allContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
