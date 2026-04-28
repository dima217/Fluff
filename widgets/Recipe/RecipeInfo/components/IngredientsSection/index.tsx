import type { ProductResponse } from "@/api/types";
import { ThemedText } from "@/shared/ui/ThemedText";
import FilterTags from "@/widgets/Search/components/FilterTags";
import React, { useMemo } from "react";
import { View } from "react-native";

interface IngredientsSectionProps {
  products?: ProductResponse[] | string | string[]; 
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  products,
}) => {
  const ingredients = useMemo(() => {
    if (!products) return [];
    
    if (typeof products === 'string') {
      return products
        .replace(/[.,!?;:()\[\]{}"'`]/g, '') 
        .split(/\s+/) 
        .filter(item => item.trim().length > 0); 
    }
    
    if (Array.isArray(products) && products.length > 0) {
      if (products[0] && typeof products[0] === 'object' && 'calories' in products[0]) {
        return (products as ProductResponse[]).map((product) => `${product.name} (${product.calories} ccal)`);
      }
      return products as string[];
    }
    
    return [];
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