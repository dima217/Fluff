import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import NutritionBadges from "@/shared/ui/NutritionBadges";
import { ThemedText } from "@/shared/ui/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

interface NutritionSectionProps {
  proteins?: number | null;
  fats?: number | null;
  carbs?: number | null;
  calories?: number;
}

const NutritionSection: React.FC<NutritionSectionProps> = ({
  proteins,
  fats,
  carbs,
  calories,
}) => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  if (proteins == null && fats == null && carbs == null) return null;

  return (
    <View style={styles.container}>
      <ThemedText type="s">{t("nutrition.nutritionValue")}</ThemedText>
      <NutritionBadges proteins={proteins} fats={fats} carbs={carbs} />
      {calories != null && (
        <ThemedText type="xs" style={styles.caloriesHint}>
          {calories} {t("health.caloriesUnit")} · {t("nutrition.per100g")}
        </ThemedText>
      )}
    </View>
  );
};

export default NutritionSection;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      gap: 12,
      marginTop: 4,
    },
    caloriesHint: {
      color: colors.secondary,
    },
  });
