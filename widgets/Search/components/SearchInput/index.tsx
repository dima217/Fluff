import Search from "@/assets/images/Search.svg";
import SearchLight from "@/assets/images/SearchLight.svg";
import { ColorPalette } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
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
import { createSearchInputStyles } from "./styles";

interface SearchInputProps {
  isFiltering?: boolean;
  searchText?: string;
  style?: StyleProp<ViewStyle>;
  selectedFilters?: string[];
  isSearchTriggered?: boolean;
  onSearchChange?: (text: string) => void;
  onToggleFilter?: () => void;
  onFilterRemove?: (filter: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  isPlaceholder?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchText = "",
  style,
  selectedFilters = [],
  isSearchTriggered,
  onSearchChange,
  onToggleFilter,
  onFilterRemove,
  onFocus,
  onBlur,
  onPress,
  isPlaceholder = false,
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createSearchInputStyles);
  const { t } = useTranslation();
  const isLightTheme =
    colors.background === ColorPalette.light.background;
  const searchIcon = isLightTheme ? <SearchLight /> : <Search />;

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
              placeholderTextColor={colors.secondary}
              editable={false}
              pointerEvents="none"
            />
          </View>
        </View>
        {onToggleFilter && (
          <Circle onPress={onToggleFilter} frostedGlass svg={searchIcon} />
        )}
      </TouchableOpacity>
    );
  }

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
            placeholderTextColor={colors.secondary}
            defaultValue={searchText}
            onChangeText={onSearchChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </View>
      </ScrollView>

      {onToggleFilter && (
        <Circle
          onPress={onToggleFilter}
          isSearchTriggered={isSearchTriggered}
          frostedGlass
          svg={searchIcon}
        />
      )}
    </View>
  );
};

export default SearchInput;
