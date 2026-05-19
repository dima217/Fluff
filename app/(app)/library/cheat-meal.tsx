import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  useAppSelector,
  useGetRecipesByIdsQuery,
  useUpdateProfileMutation,
} from "@/api";

import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { DeleteRecipeCardAction } from "@/shared/CardCarousel/cardActions";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function CheatMealScreen() {
  const styles = useThemedStyles(createstyles);
  const router = useRouter();

  const cheatMealIds = useAppSelector(
    (state) => state.user.profile?.cheatMeal ?? []
  );

  const { data, isLoading } = useGetRecipesByIdsQuery(cheatMealIds, {
    skip: cheatMealIds.length === 0,
  });

  const [updateProfile] = useUpdateProfileMutation();

  const products: MealData[] = useMemo(() => {
    if (!data) return [];

    return data.map((recipe) => ({
      id: String(recipe.id),
      title: recipe.name,
      calories: `${recipe.calories} ккал`,
      imageUrl: recipe.image.preview,
      recipeId: recipe.id,
      isFluff: true,
    }));
  }, [data]);

  const handleCardPress = useCallback(
    (item: MealData) => {
      if (item.recipeId) {
        router.push({
          pathname: "/(recipe)/recipe",
          params: { recipeId: String(item.recipeId) },
        });
      }
    },
    [router]
  );

  return (
    <View style={styles.container}>
      <Header title="Cheat Meal" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {products.length === 0 && !isLoading ? (
          <ThemedText type="xs" style={styles.empty}>
            Пока ничего нет.
          </ThemedText>
        ) : (
          <CardsCarousel
            products={products}
            variant="featured"
            onCardPress={handleCardPress}
            renderCardRightAction={(item) => (
              <DeleteRecipeCardAction
                item={item}
                onDelete={() =>
                  updateProfile({ recipeFromCheatMealId: Number(item.id) })
                }
              />
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  empty: {
    color: "#8B868F",
    textAlign: "center",
    marginTop: 24,
  },
});
