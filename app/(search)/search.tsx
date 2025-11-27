import SearchOverlayContent from "@/components/Search";
import SearchInput from "@/components/Search/ui/SearchInput";
import View from "@/components/View";
import { useState } from "react";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const availableFilters = [
    "Pancakes",
    "Recipes",
    "Eggs",
    "Milk",
    "White Bread",
    "Calories Base",
  ];

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

    const match = availableFilters.find(
      (f) => f.toLowerCase() === text.toLowerCase()
    );

    if (match) {
      addFilter(match);
      setSearchText("");
    }
  };

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
        onSelectTag={addFilter}
        selectedFilters={selectedFilters}
      />
    </View>
  );
};

export default SearchScreen;
