import Filter from "@/assets/images/Filter.svg";
import Circle from "@/shared/ui/Circle";
import React from "react";
import {
  ScrollView,
  StyleProp,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.row}>
          <FilterTags
            filters={selectedFilters}
            onRemove={onFilterRemove}
            variant="input"
          />

          <TextInput
            style={[styles.input, { minWidth: 80 }]}
            placeholder="Search"
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={onSearchChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </View>
      </ScrollView>

      <Circle onPress={onToggleFilter} frostedGlass svg={<Filter />} />
    </View>
  );
};

export default SearchInput;
