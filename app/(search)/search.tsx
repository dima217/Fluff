import {
  useGetProductsQuery,
  useLazySearchProductsQuery,
  useLazySearchRecipesQuery,
} from "@/api";
import View from "@/shared/View";
import { searchStorage } from "@/utils/searchStorage";
import SearchOverlayContent from "@/widgets/Search";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { useEffect, useMemo, useState } from "react";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Load products for tags
  const { data: productsResponse } = useGetProductsQuery({
    page: 1,
    limit: 50,
  });

  const allProducts = useMemo(() => {
    if (!productsResponse) return [];
    if (typeof productsResponse === "object" && "data" in productsResponse) {
      return Array.isArray(productsResponse.data) ? productsResponse.data : [];
    }
    return Array.isArray(productsResponse) ? productsResponse : [];
  }, [productsResponse]);

  // Lazy queries for search
  const [searchRecipes, { data: recipes, isLoading: isLoadingRecipes }] =
    useLazySearchRecipesQuery();
  const [searchProducts, { data: products, isLoading: isLoadingProducts }] =
    useLazySearchProductsQuery();

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Perform search when debounced text or selected products change
  useEffect(() => {
    const searchParams: any = {};

    if (debouncedSearchText.trim().length > 0) {
      searchParams.q = debouncedSearchText;
      searchStorage.addToSearchHistory(debouncedSearchText);
    }

    if (selectedProductIds.length > 0) {
      searchParams.productIds = selectedProductIds;
    }

    if (
      debouncedSearchText.trim().length > 0 ||
      selectedProductIds.length > 0
    ) {
      searchRecipes(searchParams);
    }

    if (debouncedSearchText.trim().length > 0) {
      searchProducts({ q: debouncedSearchText });
    }
  }, [debouncedSearchText, selectedProductIds, searchRecipes, searchProducts]);

  const addProductFilter = (productId: number) => {
    if (!selectedProductIds.includes(productId)) {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const removeProductFilter = (productId: number) => {
    setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleTagSelect = (productId: number) => {
    // Add product to filters, but don't change search text
    addProductFilter(productId);
  };

  const handleHistoryItemPress = (query: string) => {
    setSearchText(query);
  };

  // Extract recipes from response
  const recipesArray = useMemo(() => {
    if (!recipes) return [];
    if (Array.isArray(recipes)) return recipes;
    if (typeof recipes === "object" && "data" in recipes) {
      return Array.isArray(recipes.data) ? recipes.data : [];
    }
    return [];
  }, [recipes]);

  const hasSearchResults = useMemo(() => {
    return (
      (debouncedSearchText.trim().length > 0 ||
        selectedProductIds.length > 0) &&
      ((recipesArray && recipesArray.length > 0) ||
        (products && products.length > 0))
    );
  }, [debouncedSearchText, selectedProductIds, recipesArray, products]);

  const isLoading = isLoadingRecipes || isLoadingProducts;

  // Get selected product names for display
  const selectedProductNames = useMemo(() => {
    return allProducts
      .filter((p) => selectedProductIds.includes(p.id))
      .map((p) => p.name);
  }, [selectedProductIds, allProducts]);

  return (
    <View>
      <SearchInput
        isFiltering={selectedProductIds.length > 0}
        searchText={searchText}
        selectedFilters={selectedProductNames}
        onSearchChange={handleSearchChange}
        onToggleFilter={() => {}}
        onFilterRemove={(filterName) => {
          const product = allProducts.find((p) => p.name === filterName);
          if (product) {
            removeProductFilter(product.id);
          }
        }}
      />

      <SearchOverlayContent
        onSelectTag={handleTagSelect}
        selectedProductIds={selectedProductIds}
        searchText={debouncedSearchText}
        recipes={recipesArray}
        products={products}
        allProducts={allProducts}
        isLoading={isLoading}
        hasSearchResults={hasSearchResults}
        onSearchFromHistory={handleHistoryItemPress}
      />
    </View>
  );
};

export default SearchScreen;
