import { Colors } from "@/constants/Colors";
import { CircleSizes } from "@/constants/components/CIrcle";
import Circle from "@/shared/ui/Circle";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

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
                svg={<Ionicons name="close" size={14} color={Colors.border} />}
                color={Colors.purple}
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
