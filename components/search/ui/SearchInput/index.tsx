import Filter from "@/assets/images/Filter.svg";
import Search from "@/assets/images/Search.svg";
import Circle from "@/components/ui/Circle";
import { Colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import FilterTags from "../filterTags/FilterTags";

interface SearchInputProps {
  isFiltering: boolean;
  searchText: string;
  selectedFilters: string[];
  onSearchChange: (text: string) => void;
  onToggleFilter: () => void;
  onFilterRemove: (filter: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  isFiltering,
  searchText,
  selectedFilters,
  onSearchChange,
  onToggleFilter,
  onFilterRemove,
}) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.inputWrapper}>
        {isFiltering ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterTags filters={selectedFilters} onRemove={onFilterRemove} />
          </ScrollView>
        ) : (
          <>
            <Search />
            <TextInput
              style={styles.input}
              placeholder="Search"
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={onSearchChange}
            />
          </>
        )}
      </View>
      <Circle onPress={onToggleFilter} frostedGlass svg={<Filter />} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    height: 58,
    flexDirection: "row",
    backgroundColor: Colors.inactive,
    borderRadius: 34,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingRight: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    paddingLeft: 10,
    flex: 1,
    color: "white",
    fontSize: 16,
  },
});

export default SearchInput;
