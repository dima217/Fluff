import { ThemedText } from "@/shared/ui/ThemedText";
import FilterTags from "@/widgets/Search/components/FilterTags";
import { View } from "react-native";

const ingredients = [
  "Dark Chocolate (100g)",
  "Butter (180g)",
  "Wheat flour (100g)",
  "Brown Sugar (200g)",
  "Eggs (4)",
  "Walnuts (100g)",
];

const IngredientsSection = () => {
  return (
    <View style={{ gap: 10 }}>
      <ThemedText style={{ color: "#FFFFFF" }}>Ingredients</ThemedText>
      <FilterTags filters={ingredients} />
    </View>
  );
};

export default IngredientsSection;
