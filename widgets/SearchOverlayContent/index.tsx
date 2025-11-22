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

const Tag = ({ text }: { text: string }) => (
  <View style={overlayStyles.tag}>
    <Text style={overlayStyles.tagText}>{text}</Text>
  </View>
);

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
      <View style={overlayStyles.popularTagsContainer}>
        {popularRecipes.map((item, index) => (
          <Tag key={index} text={item} />
        ))}
      </View>

      <Text style={overlayStyles.sectionTitle}>Last Visited</Text>
      <CardsCarousel onCardPress={() => {}} variant="mealsToday" />
    </ScrollView>
  );
};

// --- Стили для SearchOverlayContent ---
const overlayStyles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
    marginBottom: 15,
  },
  // История поиска
  historyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  // Популярные теги
  popularTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  tagText: {
    color: "white",
    fontSize: 14,
  },
  lastVisitedScroll: {
    marginTop: 10,
  },
  card: {
    width: 150,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
  },
  cardSubtitle: {
    color: Colors.secondary,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});

export default SearchOverlayContent;
