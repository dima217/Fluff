import { CircleSizes } from "@/constants/components/CIrcle";
import { Colors } from "@/constants/design-tokens";
import CardsCarousel from "@/shared/CardCarousel";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Circle from "../../shared/ui/Circle";
import { ThemedText } from "../../shared/ui/ThemedText";
import FilterTags from "./components/FilterTags";

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

  const popularRecipes = [
    "Eggs",
    "Milk",
    "White Bread",
    "Calories Base",
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
            <ThemedText type="xs" key={index}>
              {item}
            </ThemedText>
            {index < searchHistory.length - 1 && (
              <Circle size={CircleSizes.DOT} />
            )}
          </React.Fragment>
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
  historySection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    alignItems: "center",
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
