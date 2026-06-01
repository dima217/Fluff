import type { ProductResponse, RecipeResponse } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { CircleSizes } from "@/constants/components/CIrcle";

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
import {
  getProductsAsMealData,
  getRecipesAsMealData,
} from "../Home/utils/data";
import FilterTags from "./components/FilterTags";
import LastVisitedRecipes from "./components/LastVisitedRecipes";

interface SearchOverlayContentProps {
  onSelectTag: (productId: number) => void;
  selectedProductIds: number[];
  searchText?: string;
  isSearchTriggered: boolean;
  selectedIds: number[];
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
  selectedIds = [],
  recipes = [],
  products = [],
  allProducts = [],
  isLoading = false,
  isSearchTriggered,
  hasSearchResults = false,
  onSearchFromHistory,
}) => {
  const { t } = useTranslation();
  const overlayStyles = useThemedStyles(createSearchOverlayStyles);
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [lastVisitedIds, setLastVisitedIds] = useState<number[]>([]);

  useEffect(() => {
    setSearchHistory(searchStorage.getSearchHistory());
    setLastVisitedIds(searchStorage.getLastVisited());
  }, []);

  useEffect(() => {
    if (!isSearchTriggered) {
      setSearchHistory(searchStorage.getSearchHistory());
      setLastVisitedIds(searchStorage.getLastVisited());
    }
  }, [isSearchTriggered]);

  useEffect(() => {
    if (searchText.trim().length === 0) {
      setSearchHistory(searchStorage.getSearchHistory());
      setLastVisitedIds(searchStorage.getLastVisited());
    }
  }, [searchText]);

  const handleRecipePress = (item: MealData) => {
    if (item.recipeId) {
      searchStorage.addToLastVisited(item.recipeId);
      console.log(item.recipeId);
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

  const popularProducts = useMemo(() => {
    return allProducts.slice(0, 20);
  }, [allProducts]);

  const recipesAsMealData: MealData[] = useMemo(
    () => getRecipesAsMealData(recipes),
    [recipes]
  );
  const productsAsMealData: MealData[] = useMemo(
    () => getProductsAsMealData(products),
    [products]
  );

  if (
    (searchText.trim().length > 0 || selectedIds.length > 0) &&
    isSearchTriggered
  ) {
    return (
      <ScrollView
        style={overlayStyles.scrollContainer}
        contentContainerStyle={overlayStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ThemedText type="xs" style={overlayStyles.loadingText}>
            {t("search.searching")}
          </ThemedText>
        ) : hasSearchResults ? (
          <>
            {recipes.length > 0 && (
              <>
                <Text style={overlayStyles.sectionTitle}>
                  {t("search.recipes")}
                </Text>
                <CardsCarousel
                  products={recipesAsMealData}
                  onCardPress={handleRecipePress}
                  variant="featured"
                />
              </>
            )}

            {products.length > 0 && (
              <>
                <Text style={overlayStyles.sectionTitle}>
                  {t("search.products")}
                </Text>
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
            {t("search.noResults")}
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
      <Text style={overlayStyles.sectionTitle}>{t("search.history")}</Text>

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
          {t("search.noHistory")}
        </ThemedText>
      )}

      <Text style={overlayStyles.sectionTitle}>
        {t("homeSections.popularRecipes")}
      </Text>

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

      <Text style={overlayStyles.sectionTitle}>{t("search.lastVisited")}</Text>
      {lastVisitedIds.length > 0 ? (
        <LastVisitedRecipes
          recipeIds={lastVisitedIds}
          onCardPress={handleRecipePress}
        />
      ) : (
        <ThemedText type="xs" style={overlayStyles.emptyText}>
          {t("search.noLastVisited")}
        </ThemedText>
      )}
    </ScrollView>
  );
};

const createSearchOverlayStyles = (colors: AppColors) =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.text,
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
      color: colors.text,
      fontSize: 16,
      marginRight: 10,
      marginBottom: 10,
    },
    historyItem: {
      color: colors.text,
    },
    loadingText: {
      color: colors.text,
      textAlign: "center",
      marginTop: 30,
    },
    emptyText: {
      color: colors.secondary,
      textAlign: "center",
      marginTop: 30,
    },
  });

export default SearchOverlayContent;
