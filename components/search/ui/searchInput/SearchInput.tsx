import { Colors } from "@/constants/Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
            <AntDesign
              name="search"
              size={18}
              color="gray"
              style={styles.searchIcon}
            />
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
      <TouchableOpacity onPress={onToggleFilter}>
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
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
    flex: 1,
    color: "white",
    fontSize: 16,
  },
});

export default SearchInput;
