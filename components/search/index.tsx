import CardsCarousel from "@/components/CardCarousel";
import { Colors } from "@/constants/Colors";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FilterTags from "./ui/FilterTags";

interface SearchOverlayContentProps {
  onSelectTag: (tag: string) => void;
  selectedFilters: string[];
}

const SearchOverlayContent: React.FC<SearchOverlayContentProps> = ({
  onSelectTag,
}) => {
  const searchHistory = [
    "Pancakes",
    "Recipes",
    "Eggs",
    "Milk",
    "White Bread",
    "Calories Base",
  ];

  const popularRecipes = ["Eggs", "Milk", "White Bread", "Calories Base"];

  return (
    <ScrollView
      style={overlayStyles.scrollContainer}
      contentContainerStyle={overlayStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={overlayStyles.sectionTitle}>Search History</Text>
      <View style={overlayStyles.historyContainer}>
        {searchHistory.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => onSelectTag(item)}>
            <Text style={overlayStyles.historyText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={overlayStyles.sectionTitle}>Popular recipes</Text>
      <FilterTags
        filters={popularRecipes}
        onRemove={() => {}}
        onTagPress={onSelectTag}
      />

      <Text style={overlayStyles.sectionTitle}>Last Visited</Text>
      <CardsCarousel onCardPress={() => {}} variant="mealsToday" />
    </ScrollView>
  );
};

const overlayStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
    marginBottom: 15,
  },
  historyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignSelf: "flex-start",
  },
  historyText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default SearchOverlayContent;
