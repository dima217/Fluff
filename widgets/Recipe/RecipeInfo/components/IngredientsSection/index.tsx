import type {
  RecipeCustomProductResponse,
  RecipeProductResponse,
} from "@/api/types";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import FilterTags from "@/widgets/Search/components/FilterTags";
import React, { useMemo } from "react";
import { View } from "react-native";

interface IngredientsSectionProps {
  products?: RecipeProductResponse[];
  customProducts?: RecipeCustomProductResponse[];
  dense?: boolean;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  products,
  customProducts,
  dense = false,
}) => {
  const { t } = useTranslation();

  const ingredients = useMemo(() => {
    const result: string[] = [];

    (products ?? []).forEach((p) => {
      if (p.grams) {
        const unit = p.unit ?? t("recipe.gramsUnit");
        result.push(`${p.name} · ${p.grams} ${unit}`);
      } else {
        result.push(`${p.name} · ${Math.round(p.calories)} ${t("health.caloriesUnit")}`);
      }
    });

    (customProducts ?? []).forEach((p) => {
      if (p.grams) {
        const unit = p.unit ?? t("recipe.gramsUnit");
        result.push(`${p.name} · ${p.grams} ${unit}`);
      } else {
        result.push(p.name);
      }
    });

    return result;
  }, [products, customProducts, t]);

  if (ingredients.length === 0) return null;

  return (
    <View style={{ gap: dense ? 6 : 10, marginTop: dense ? 6 : 0 }}>
      <ThemedText>{t("recipe.ingredients")}</ThemedText>
      <FilterTags filters={ingredients} />
    </View>
  );
};

export default IngredientsSection;
