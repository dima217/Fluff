import { useLazySearchProductsQuery, useLazySearchRecipesQuery } from "@/api";
import View from "@/shared/View";
import SearchOverlayContent from "@/widgets/Search";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { useEffect, useMemo, useState } from "react";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

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

  // Perform search when debounced text changes
  useEffect(() => {
    if (debouncedSearchText.trim().length > 0) {
      searchRecipes({ q: debouncedSearchText });
      searchProducts({ q: debouncedSearchText });
    }
  }, [debouncedSearchText, searchRecipes, searchProducts]);

  const addFilter = (filter: string) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleTagSelect = (tag: string) => {
    addFilter(tag);
  };

  const hasSearchResults = useMemo(() => {
    return (
      debouncedSearchText.trim().length > 0 &&
      ((recipes && recipes.length > 0) || (products && products.length > 0))
    );
  }, [debouncedSearchText, recipes, products]);

  const isLoading = isLoadingRecipes || isLoadingProducts;

  return (
    <View>
      <SearchInput
        isFiltering={selectedFilters.length > 0}
        searchText={searchText}
        selectedFilters={selectedFilters}
        onSearchChange={handleSearchChange}
        onToggleFilter={() => {}}
        onFilterRemove={removeFilter}
      />

      <SearchOverlayContent
        onSelectTag={handleTagSelect}
        selectedFilters={selectedFilters}
        searchText={debouncedSearchText}
        recipes={recipes}
        products={products}
        isLoading={isLoading}
        hasSearchResults={hasSearchResults}
      />
    </View>
  );
};

export default SearchScreen;
