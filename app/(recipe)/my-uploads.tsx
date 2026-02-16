import { useGetMyRecipesQuery } from "@/api";
import type { RecipeResponse } from "@/api/types";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { EditRecipeCardAction } from "@/shared/CardCarousel/cardActions";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function MyUploadsScreen() {
  const router = useRouter();
  const { data: recipes, isLoading } = useGetMyRecipesQuery();

  const recipesAsMealData: MealData[] = useMemo(() => {
    if (!recipes || !Array.isArray(recipes)) return [];
    return recipes.map((recipe: RecipeResponse) => ({
      id: recipe.id.toString(),
      title: recipe.name,
      calories: `${recipe.calories} ккал`,
      imageUrl: recipe.image?.cover || recipe.image?.preview || "",
      isLiked: recipe.favorite,
      recipeId: recipe.id,
    }));
  }, [recipes]);

  const handleCardPress = (item: MealData) => {
    if (item.recipeId) {
      router.push({
        pathname: "/(recipe)/recipe",
        params: { recipeId: item.recipeId.toString() },
      });
    }
  };

  const handleEditPress = (item: MealData) => {
    if (item.recipeId) {
      router.push({
        pathname: "/(recipe)/edit-recipe",
        params: { recipeId: item.recipeId.toString() },
      });
    }
  };

  return (
    <View>
      <Header title="My Uploads" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ThemedText type="xs">Загрузка...</ThemedText>
        ) : recipesAsMealData.length > 0 ? (
          <CardsCarousel
            products={recipesAsMealData}
            variant="featured"
            onCardPress={handleCardPress}
            renderCardRightAction={(item) => (
              <EditRecipeCardAction item={item} onEdit={handleEditPress} />
            )}
          />
        ) : (
          <ThemedText type="xs" style={styles.empty}>
            У вас пока нет загруженных рецептов
          </ThemedText>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    paddingBottom: 40,
  },
  empty: {
    opacity: 0.8,
    marginTop: 20,
  },
});
