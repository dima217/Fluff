import type { ProductResponse } from "@/api/types";
import { ThemedText } from "@/shared/ui/ThemedText";
import FilterTags from "@/widgets/Search/components/FilterTags";
import React, { useMemo } from "react";
import { View } from "react-native";

interface IngredientsSectionProps {
  products?: ProductResponse[];
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({ products }) => {
  const ingredients = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.map(
      (product) => `${product.name} (${product.massa}г)`
    );
  }, [products]);

  if (ingredients.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: 10 }}>
      <ThemedText style={{ color: "#FFFFFF" }}>Ingredients</ThemedText>
      <FilterTags filters={ingredients} />
    </View>
  );
};

export default IngredientsSection;
