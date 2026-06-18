import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface NutritionValues {
  proteins?: number | null;
  fats?: number | null;
  carbs?: number | null;
}

interface NutritionBadgesProps extends NutritionValues {
  /** Show label above each badge (default true) */
  showLabels?: boolean;
  /** Compact single-row layout (default false) */
  compact?: boolean;
}

const BADGE_COLORS = {
  proteins: "#5B8AF5",
  fats: "#F5A623",
  carbs: "#33AD2D",
} as const;

const NutritionBadges: React.FC<NutritionBadgesProps> = ({
  proteins,
  fats,
  carbs,
  showLabels = true,
  compact = false,
}) => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  if (proteins == null && fats == null && carbs == null) return null;

  const items = [
    { key: "proteins", label: t("nutrition.proteins"), short: t("nutrition.proteinsShort"), value: proteins, color: BADGE_COLORS.proteins },
    { key: "fats",     label: t("nutrition.fats"),     short: t("nutrition.fatsShort"),     value: fats,     color: BADGE_COLORS.fats },
    { key: "carbs",    label: t("nutrition.carbs"),     short: t("nutrition.carbsShort"),    value: carbs,    color: BADGE_COLORS.carbs },
  ].filter((item) => item.value != null);

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {items.map((item) => (
        <View key={item.key} style={[styles.badge, compact && styles.badgeCompact]}>
          {showLabels && (
            <Text style={[styles.label, { color: item.color }]}>
              {compact ? item.short : item.label}
            </Text>
          )}
          <Text style={styles.value}>
            {item.value!.toFixed(1)}{" "}
            <Text style={styles.unit}>{t("nutrition.gUnit")}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
};

export default NutritionBadges;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    rowCompact: {
      gap: 6,
    },
    badge: {
      flex: 1,
      minWidth: 80,
      backgroundColor: colors.inactive,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      alignItems: "center",
    },
    badgeCompact: {
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 8,
    },
    label: {
      fontSize: 11,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    unit: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.secondary,
    },
  });
