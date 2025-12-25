import { useTranslation } from "@/hooks/useTranslation";
import View from "@/shared/View";
import SearchOverlayContent from "@/widgets/Search";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { useState } from "react";

const SearchScreen = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const availableFilters = [
    t("search.pancakes"),
    t("search.recipes"),
    t("search.eggs"),
    t("search.milk"),
    t("search.whiteBread"),
    t("search.caloriesBase"),
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
