import type { ProductResponse, RecipeResponse } from "@/api/types";
import { CircleSizes } from "@/constants/components/CIrcle";
import { Colors } from "@/constants/design-tokens";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Circle from "../../shared/ui/Circle";
import { ThemedText } from "../../shared/ui/ThemedText";
import FilterTags from "./components/FilterTags";

interface SearchOverlayContentProps {
  onSelectTag: (tag: string) => void;
  selectedFilters: string[];
  searchText?: string;
  recipes?: RecipeResponse[];
  products?: ProductResponse[];
  isLoading?: boolean;
  hasSearchResults?: boolean;
}

const SearchOverlayContent: React.FC<SearchOverlayContentProps> = ({
  onSelectTag,
  searchText = "",
  recipes = [],
  products = [],
  isLoading = false,
  hasSearchResults = false,
}) => {
  const router = useRouter();

  const handleRecipePress = (item: MealData) => {
    if (item.recipeId) {
      router.push({
        pathname: "/(recipe)/recipe",
        params: { recipeId: item.recipeId.toString() },
      });
    }
  };
  const searchHistory = [
    "Pancakes",
    "Recipes",
    "Eggs",
    "Milk",
    "White Bread",
    "Calories Base",
  ];

  const popularRecipes = [
    "Eggs",
    "Milk",
    "White Bread",
    "Calories Base",
    "Calories Base",
    "Calories Base",
    "Calories Base",
  ];

  // Convert recipes to MealData format
  const recipesAsMealData: MealData[] = useMemo(() => {
    return recipes.map((recipe) => ({
      id: recipe.id.toString(),
      title: recipe.name,
      calories: `${recipe.calories} ккал`,
      imageUrl: recipe.image?.cover || recipe.image?.preview || "",
      isLiked: recipe.favorite,
      recipeId: recipe.id,
    }));
  }, [recipes]);

  // Convert products to MealData format
  const productsAsMealData: MealData[] = useMemo(() => {
    return products.map((product) => ({
      id: product.id.toString(),
      title: product.name,
      calories: `${product.calories} ккал / ${product.massa}г`,
      imageUrl: product.image?.cover || product.image?.preview || "",
      isLiked: product.favorite,
      productId: product.id,
    }));
  }, [products]);

  // Show search results if there's a search query
  if (searchText.trim().length > 0) {
    return (
      <ScrollView
        style={overlayStyles.scrollContainer}
        contentContainerStyle={overlayStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ThemedText type="xs" style={overlayStyles.loadingText}>
            Поиск...
          </ThemedText>
        ) : hasSearchResults ? (
          <>
            {recipes.length > 0 && (
              <>
                <Text style={overlayStyles.sectionTitle}>Рецепты</Text>
                <CardsCarousel
                  products={recipesAsMealData}
                  onCardPress={handleRecipePress}
                  variant="featured"
                />
              </>
            )}

            {products.length > 0 && (
              <>
                <Text style={overlayStyles.sectionTitle}>Продукты</Text>
                <CardsCarousel
                  products={productsAsMealData}
                  onCardPress={() => {}}
                  variant="featured"
                />
              </>
            )}
          </>
        ) : (
          <ThemedText type="xs" style={overlayStyles.emptyText}>
            Ничего не найдено
          </ThemedText>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={overlayStyles.scrollContainer}
      contentContainerStyle={overlayStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={overlayStyles.sectionTitle}>Search History</Text>

      <View style={overlayStyles.historyContainer}>
        {searchHistory.map((item, index) => (
          <React.Fragment key={index}>
            <ThemedText type="xs" key={index}>
              {item}
            </ThemedText>
            {index < searchHistory.length - 1 && (
              <Circle size={CircleSizes.DOT} />
            )}
          </React.Fragment>
        ))}
      </View>

      <Text style={overlayStyles.sectionTitle}>Popular recipes</Text>

      <FilterTags
        filters={popularRecipes}
        onRemove={() => {}}
        onTagPress={onSelectTag}
      />

      <Text style={overlayStyles.sectionTitle}>Last Visited</Text>
      <CardsCarousel onCardPress={(item) => {}} variant="mealsToday" />
    </ScrollView>
  );
};

const overlayStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  historySection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
    marginBottom: 15,
  },
  historyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  historyText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  loadingText: {
    color: "white",
    textAlign: "center",
    marginTop: 30,
  },
  emptyText: {
    color: "gray",
    textAlign: "center",
    marginTop: 30,
  },
});

export default SearchOverlayContent;
