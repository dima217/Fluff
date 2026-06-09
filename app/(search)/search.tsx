import {
  useGetProductsQuery,
  useLazySearchProductsQuery,
  useLazySearchRecipesQuery,
} from "@/api";

import View from "@/shared/View";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import SearchOverlayContent from "@/widgets/Search";
import SearchInput from "@/widgets/Search/components/SearchInput";

import { normalizeApiArray } from "@/utils/normalizeApiArray";

import { tryAddMatchedProduct } from "@/widgets/Search/utils/tryAddMatchedProduct";
import { searchStorage } from "@/storage/search/searchStorage";
import { useCallback, useMemo, useState } from "react";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  const { data: productsResponse } = useGetProductsQuery({
    page: 1,
    limit: 50,
  });

  const [searchRecipes, { data: recipes, isLoading: isLoadingRecipes }] =
    useLazySearchRecipesQuery();

  const [searchProducts, { data: products, isLoading: isLoadingProducts }] =
    useLazySearchProductsQuery();

  const allProducts = useMemo(
    () => normalizeApiArray<any>(productsResponse),
    [productsResponse]
  );

  const recipesArray = useMemo(
    () => normalizeApiArray<any>(recipes),
    [recipes]
  );

  const isLoading = isLoadingRecipes || isLoadingProducts;

  const selectedProductNames = useMemo(() => {
    return allProducts
      .filter((p) => selectedProductIds.includes(p.id))
      .map((p) => p.name);
  }, [selectedProductIds, allProducts]);

  const hasSearchResults = useMemo(() => {
    return (
      (searchText.trim().length > 0 || selectedProductIds.length > 0) &&
      (recipesArray.length > 0 || (products?.length ?? 0) > 0)
    );
  }, [searchText, selectedProductIds, recipesArray, products]);

  const addProductFilter = useCallback((productId: number) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev;
      }

      return [...prev, productId];
    });
  }, []);

  const removeProductFilter = useCallback((productId: number) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);

      tryAddMatchedProduct({
        text,
        products: allProducts,
        selectedIds: selectedProductIds,
        onAdd: addProductFilter,
        onClearText: () => setSearchText(""),
      });
      setIsSearchTriggered(false);
    },
    [allProducts, selectedProductIds, addProductFilter]
  );

  const handleTagSelect = useCallback(
    (productId: number) => {
      addProductFilter(productId);
    },
    [addProductFilter]
  );

  const handleHistoryItemPress = useCallback((query: string) => {
    setSearchText(query);
  }, []);

  const handleToggleFilter = useCallback(() => {
    if (searchText === "" && selectedProductIds.length <= 0) {
      setIsSearchTriggered(false);
      return;
    }
    if (isSearchTriggered) {
      setIsSearchTriggered(false);
      return;
    }

    const trimmedQuery = searchText.trim();
    if (trimmedQuery.length > 0) {
      searchStorage.addToSearchHistory(trimmedQuery);
    }

    searchRecipes({ q: searchText, productIds: selectedProductIds });
    searchProducts({ q: searchText });
    setIsSearchTriggered(true);
  }, [
    isSearchTriggered,
    searchProducts,
    searchRecipes,
    searchText,
    selectedProductIds,
  ]);

  const handleFilterRemove = useCallback(
    (filterName: string) => {
      const product = allProducts.find((p) => p.name === filterName);

      if (product) {
        removeProductFilter(product.id);
      }
    },
    [allProducts, removeProductFilter]
  );

  return (
    <View>
      <SearchInput
        isFiltering={selectedProductIds.length > 0}
        isSearchTriggered={isSearchTriggered}
        searchText={searchText}
        selectedFilters={selectedProductNames}
        onSearchChange={handleSearchChange}
        onToggleFilter={handleToggleFilter}
        onFilterRemove={handleFilterRemove}
      />

      <KeyboardAwareView style={{ flex: 1 }}>
        <SearchOverlayContent
          onSelectTag={handleTagSelect}
          selectedProductIds={selectedProductIds}
          isSearchTriggered={isSearchTriggered}
          searchText={searchText}
          selectedIds={selectedProductIds}
          recipes={recipesArray}
          products={products}
          allProducts={allProducts}
          isLoading={isLoading}
          hasSearchResults={hasSearchResults}
          onSearchFromHistory={handleHistoryItemPress}
        />
      </KeyboardAwareView>
    </View>
  );
};

export default SearchScreen;
