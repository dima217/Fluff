import Filter from "@/assets/images/Filter.svg";
import Search from "@/assets/images/Search.svg";
import Circle from "@/components/ui/Circle";
import React from "react";
import { StyleProp, TextInput, View, ViewStyle } from "react-native";
import FilterTags from "../FilterTags";
import { styles } from "./styles";

interface SearchInputProps {
  isFiltering: boolean;
  searchText: string;
  style?: StyleProp<ViewStyle>;
  selectedFilters: string[];
  onSearchChange: (text: string) => void;
  onToggleFilter: () => void;
  onFilterRemove: (filter: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  isFiltering,
  searchText,
  style,
  selectedFilters,
  onSearchChange,
  onToggleFilter,
  onFilterRemove,
  onFocus,
  onBlur,
}) => {
  return (
    <View style={[styles.searchBarContainer, style]}>
      <View style={styles.inputWrapper}>
        {isFiltering ? (
          <FilterTags filters={selectedFilters} onRemove={onFilterRemove} />
        ) : (
          <>
            <Search />
            <TextInput
              style={styles.input}
              placeholder="Search"
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={onSearchChange}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </>
        )}
      </View>
      <Circle onPress={onToggleFilter} frostedGlass svg={<Filter />} />
    </View>
  );
};

export default SearchInput;
