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

const SearchOverlayContent: React.FC = () => {
  const searchHistory = [
    "Pancakes",
    "Recipes",
    "Recipes",
    "Recipes",
    "Recipes",
    "Recipes",
    "Recipes",
    "Recipes",
    "Recipes",
    "Recipes",
  ];
  const popularRecipes = [
    "Eggs",
    "Milk",
    "White Bread",
    "Calories Base",
    "Calories Base",
    "Calories Base",
  ];

  return (
    <ScrollView
      style={overlayStyles.scrollContainer}
      contentContainerStyle={overlayStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={overlayStyles.sectionTitle}>Search History</Text>
      <View style={overlayStyles.historyContainer}>
        {searchHistory.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity>
              <Text style={overlayStyles.historyText}>{item}</Text>
            </TouchableOpacity>
            {index < searchHistory.length - 1 && (
              <View style={overlayStyles.dot} />
            )}
          </React.Fragment>
        ))}
      </View>

      <Text style={overlayStyles.sectionTitle}>Popular recipes</Text>
      <FilterTags filters={popularRecipes} onRemove={() => {}} />

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
    paddingHorizontal: "5%",
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
    gap: 8,
    alignSelf: "flex-start",
  },
  historyText: {
    color: "white",
    fontSize: 14,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary || "#FF6B6B",
    alignSelf: "center",
  },
});

export default SearchOverlayContent;
