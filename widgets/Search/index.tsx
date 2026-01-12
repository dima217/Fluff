import type { ProductResponse, RecipeResponse } from "@/api/types";
import { CircleSizes } from "@/constants/components/CIrcle";
import { Colors } from "@/constants/design-tokens";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { searchStorage } from "@/utils/searchStorage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Circle from "../../shared/ui/Circle";
import { ThemedText } from "../../shared/ui/ThemedText";
import FilterTags from "./components/FilterTags";
import LastVisitedRecipes from "./components/LastVisitedRecipes";

interface SearchOverlayContentProps {
  onSelectTag: (productId: number) => void;
  selectedProductIds: number[];
  searchText?: string;
  recipes?: RecipeResponse[];
  products?: ProductResponse[];
  allProducts?: ProductResponse[];
  isLoading?: boolean;
  hasSearchResults?: boolean;
  onSearchFromHistory?: (query: string) => void;
}

const SearchOverlayContent: React.FC<SearchOverlayContentProps> = ({
  onSelectTag,
  selectedProductIds,
  searchText = "",
  recipes = [],
  products = [],
  allProducts = [],
  isLoading = false,
  hasSearchResults = false,
  onSearchFromHistory,
}) => {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [lastVisitedIds, setLastVisitedIds] = useState<number[]>([]);

  // Load search history and last visited on mount
  useEffect(() => {
    setSearchHistory(searchStorage.getSearchHistory());
    setLastVisitedIds(searchStorage.getLastVisited());
  }, []);

  // Reload when search text changes (to update history)
  useEffect(() => {
    if (searchText.trim().length === 0) {
      setSearchHistory(searchStorage.getSearchHistory());
      setLastVisitedIds(searchStorage.getLastVisited());
    }
  }, [searchText]);

  const handleRecipePress = (item: MealData) => {
    if (item.recipeId) {
      router.push({
        pathname: "/(recipe)/recipe",
        params: { recipeId: item.recipeId.toString() },
      });
    }
  };

  const handleHistoryItemPress = (query: string) => {
    if (onSearchFromHistory) {
      onSearchFromHistory(query);
    }
  };

  // Use real products for tags (first 20 products)
  const popularProducts = useMemo(() => {
    return allProducts.slice(0, 20);
  }, [allProducts]);

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

      {searchHistory.length > 0 ? (
        <View style={overlayStyles.historyContainer}>
          {searchHistory.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity onPress={() => handleHistoryItemPress(item)}>
                <ThemedText type="xs" style={overlayStyles.historyItem}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
              {index < searchHistory.length - 1 && (
                <Circle size={CircleSizes.DOT} />
              )}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <ThemedText type="xs" style={overlayStyles.emptyText}>
          Нет истории поиска
        </ThemedText>
      )}

      <Text style={overlayStyles.sectionTitle}>Popular recipes</Text>

      <FilterTags
        filters={popularProducts.map((p: ProductResponse) => p.name)}
        onRemove={() => {}}
        onTagPress={(productName) => {
          const product = popularProducts.find(
            (p: ProductResponse) => p.name === productName
          );
          if (product) {
            onSelectTag(product.id);
          }
        }}
      />

      <Text style={overlayStyles.sectionTitle}>Last Visited</Text>
      {lastVisitedIds.length > 0 ? (
        <LastVisitedRecipes
          recipeIds={lastVisitedIds}
          onCardPress={handleRecipePress}
        />
      ) : (
        <ThemedText type="xs" style={overlayStyles.emptyText}>
          Нет посещенных рецептов
        </ThemedText>
      )}
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
  historyItem: {
    color: "white",
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
