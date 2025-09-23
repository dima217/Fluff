import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          <Text style={styles.filterPillText}>{filter}</Text>
          <TouchableOpacity onPress={() => onRemove(filter)}>
            <Ionicons name="close" size={14} color="white" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'darkgray',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  filterPillText: {
    color: 'white',
    marginRight: 5,
  },
  placeholderText: {
    color: 'gray',
    marginLeft: 10,
  },
});

export default FilterTags;