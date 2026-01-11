import Search from "@/assets/images/Search.svg";
import { useTranslation } from "@/hooks/useTranslation";
import Circle from "@/shared/ui/Circle";
import React from "react";
import {
  TextInput as RNTextInput,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import FilterBig from "@/assets/images/Filter_big.svg";
import FilterTags from "../FilterTags";
import { styles } from "./styles";

interface SearchInputProps {
  isFiltering?: boolean;
  searchText?: string;
  style?: StyleProp<ViewStyle>;
  selectedFilters?: string[];
  onSearchChange?: (text: string) => void;
  onToggleFilter?: () => void;
  onFilterRemove?: (filter: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void; // For navigation to search screen
  isPlaceholder?: boolean; // If true, shows as a button instead of input
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchText = "",
  style,
  selectedFilters = [],
  onSearchChange,
  onToggleFilter,
  onFilterRemove,
  onFocus,
  onBlur,
  onPress,
  isPlaceholder = false,
}) => {
  const { t } = useTranslation();

  // If it's a placeholder (button), show simple clickable view
  if (isPlaceholder) {
    return (
      <TouchableOpacity
        style={[styles.searchBarContainer, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.placeholderContent}>
          <FilterBig width={26} height={26} />
          <View style={styles.placeholderText}>
            <RNTextInput
              style={styles.placeholderInput}
              placeholder={t("common.search")}
              placeholderTextColor="gray"
              editable={false}
              pointerEvents="none"
            />
          </View>
        </View>
        {onToggleFilter && (
          <Circle onPress={onToggleFilter} frostedGlass svg={<Search />} />
        )}
      </TouchableOpacity>
    );
  }

  // Full search input with filters
  return (
    <View style={[styles.searchBarContainer, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <FilterBig width={26} height={26} />
        <View style={styles.row}>
          {selectedFilters.length > 0 && (
            <FilterTags
              filters={selectedFilters}
              onRemove={onFilterRemove}
              variant="input"
            />
          )}

          <RNTextInput
            style={[styles.input, { minWidth: 200 }]}
            placeholder={t("common.search")}
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={onSearchChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </View>
      </ScrollView>

      {onToggleFilter && (
        <Circle onPress={onToggleFilter} frostedGlass svg={<Search />} />
      )}
    </View>
  );
};

export default SearchInput;
