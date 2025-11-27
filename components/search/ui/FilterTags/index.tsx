import { ThemedText } from "@/components/ui/ThemedText";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface FilterTagsProps {
  filters: string[];
  onRemove: (filter: string) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ filters, onRemove }) => {
  if (filters.length === 0) {
    return <Text style={styles.placeholderText}>Select filters</Text>;
  }

  return (
    <View style={styles.filtersContainer}>
      {filters.map((filter, index) => (
        <View key={index} style={styles.filterPill}>
          <ThemedText type="xs">{filter}</ThemedText>
          <TouchableOpacity onPress={() => onRemove(filter)}></TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default FilterTags;
