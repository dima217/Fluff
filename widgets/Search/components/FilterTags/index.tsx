import { CircleSizes } from "@/constants/components/CIrcle";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Circle from "@/shared/ui/Circle";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { createFilterTagsStyles } from "./styles";

interface FilterTagsProps {
  filters: string[];
  onRemove?: (filter: string) => void;
  onTagPress?: (filter: string) => void;
  variant?: "default" | "input";
}

const FilterTags: React.FC<FilterTagsProps> = ({
  filters,
  onRemove,
  onTagPress,
  variant = "default",
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createFilterTagsStyles);

  if (filters.length === 0) {
    return null;
  }

  return (
    <View style={[styles.filtersContainer, variant === "input" && styles.row]}>
      {filters.map((filter, index) => (
        <View
          key={index}
          style={[styles.filterPill, variant === "input" && styles.inputPill]}
        >
          <TouchableOpacity onPress={() => onTagPress?.(filter)}>
            <ThemedText
              type="xs"
              style={variant === "input" && styles.inputText}
            >
              {filter}
            </ThemedText>
          </TouchableOpacity>

          {variant === "input" && onRemove && (
            <TouchableOpacity
              onPress={() => onRemove(filter)}
              style={styles.removeIconWrapper}
            >
              <Circle
                svg={<Ionicons name="close" size={14} color={colors.border} />}
                color={colors.purple}
                size={CircleSizes.S}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

export default FilterTags;
