import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './search.modal.styles';
import SearchInput from './ui/searchInput/SearchInput';

interface SearchModalProps {
  onClose: () => void;
}

const popularRecipes: string[] = ['Eggs', 'Milk', 'Calories Base', 'Calories Base', 'Calories Base'];
const searchHistory: string[] = ['Pancakes', 'Recipes', 'Recipes', 'Recipes', 'Recipes', 'Recipes', 'Recipes', 'Recipes', 'Recipes'];

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterPress = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(item => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
    setIsFiltering(true);
  };

  const renderContent = () => {
    if (isFiltering) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Filters</Text>
          <View style={styles.tagsContainer}>
            {popularRecipes.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleFilterPress(item)}
                style={[
                  styles.popularTag,
                  selectedFilters.includes(item) && styles.selectedTag
                ]}
              >
                <Text style={[styles.tagText, selectedFilters.includes(item) && styles.selectedTagText]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      return (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search History</Text>
            <View style={styles.tagsContainer}>
              {searchHistory.map((item, index) => (
                <Text key={index} style={styles.tag}>{item}</Text>
              ))}
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular recipes</Text>
            <View style={styles.tagsContainer}>
              {popularRecipes.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleFilterPress(item)} style={styles.popularTag}>
                  <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        isFiltering={isFiltering}
        searchText={searchText}
        selectedFilters={selectedFilters}
        onSearchChange={setSearchText}
        onToggleFilter={() => setIsFiltering(!isFiltering)}
        onFilterRemove={handleFilterPress}
      />
      
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle-outline" size={24} color="gray" />
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchModal;