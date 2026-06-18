import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NutrientNorms {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

interface NutrientDetailsModalProps {
  isVisible: boolean;
  norms: NutrientNorms | null;
  onClose: () => void;
}

const BADGE_COLORS = {
  calories: "#E95285",
  proteins: "#5B8AF5",
  fats:     "#F5A623",
  carbs:    "#33AD2D",
} as const;

const NutrientDetailsModal: React.FC<NutrientDetailsModalProps> = ({
  isVisible,
  norms,
  onClose,
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.wrapper}>
          <GradientView style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <ThemedText type="subtitle">{t("nutrition.nutrientDetailsTitle")}</ThemedText>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {norms ? (
              <>
                <ThemedText type="xs" style={styles.subtitle}>
                  {t("nutrition.nutrientDetailsSubtitle")}
                </ThemedText>

                {/* Nutrient rows */}
                <View style={styles.nutrientsList}>
                  <NutrientRow
                    label={t("health.calories")}
                    value={Math.round(norms.calories)}
                    unit={t("health.caloriesUnit")}
                    color={BADGE_COLORS.calories}
                    styles={styles}
                    colors={colors}
                    percentage={100}
                  />
                  <NutrientRow
                    label={t("nutrition.proteins")}
                    value={Math.round(norms.proteins)}
                    unit={t("nutrition.gUnit")}
                    color={BADGE_COLORS.proteins}
                    styles={styles}
                    colors={colors}
                    percentage={(norms.proteins * 4 / norms.calories) * 100}
                  />
                  <NutrientRow
                    label={t("nutrition.fats")}
                    value={Math.round(norms.fats)}
                    unit={t("nutrition.gUnit")}
                    color={BADGE_COLORS.fats}
                    styles={styles}
                    colors={colors}
                    percentage={(norms.fats * 9 / norms.calories) * 100}
                  />
                  <NutrientRow
                    label={t("nutrition.carbs")}
                    value={Math.round(norms.carbs)}
                    unit={t("nutrition.gUnit")}
                    color={BADGE_COLORS.carbs}
                    styles={styles}
                    colors={colors}
                    percentage={(norms.carbs * 4 / norms.calories) * 100}
                  />
                </View>
              </>
            ) : (
              <ThemedText type="xs" style={styles.noDataHint}>
                {t("nutrition.noDataHint")}
              </ThemedText>
            )}

            <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.primary }]} onPress={onClose}>
              <Text style={styles.closeButtonText}>{t("common.close")}</Text>
            </TouchableOpacity>
          </GradientView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* ── Row sub-component ─────────────────────────────────────────────── */

interface NutrientRowProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  percentage: number;
  styles: ReturnType<typeof createStyles>;
  colors: AppColors;
}

const NutrientRow: React.FC<NutrientRowProps> = ({
  label, value, unit, color, percentage, styles, colors,
}) => (
  <View style={styles.nutrientRow}>
    <View style={styles.nutrientLeft}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.nutrientLabel, { color: colors.text }]}>{label}</Text>
    </View>
    <View style={styles.nutrientRight}>
      <Text style={[styles.nutrientValue, { color: colors.text }]}>
        {value} <Text style={[styles.nutrientUnit, { color: colors.secondary }]}>{unit}</Text>
      </Text>
      <Text style={[styles.nutrientPct, { color }]}>
        {Math.round(percentage)}%
      </Text>
    </View>
    {/* Progress bar */}
    <View style={[styles.barBg, { backgroundColor: colors.inactive }]}>
      <View style={[styles.barFill, { width: `${Math.min(percentage, 100)}%` as any, backgroundColor: color }]} />
    </View>
  </View>
);

export default NutrientDetailsModal;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    wrapper: {
      width: "100%",
      maxWidth: 400,
    },
    card: {
      borderRadius: 20,
      padding: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    subtitle: {
      color: colors.secondary,
      marginBottom: 20,
      lineHeight: 18,
    },
    closeBtn: {
      color: colors.secondary,
      fontSize: 18,
      padding: 4,
    },
    nutrientsList: {
      gap: 16,
      marginBottom: 24,
    },
    nutrientRow: {
      gap: 6,
    },
    nutrientLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    nutrientLabel: {
      fontSize: 14,
      fontWeight: "500",
    },
    nutrientRight: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 16,
    },
    nutrientValue: {
      fontSize: 16,
      fontWeight: "700",
    },
    nutrientUnit: {
      fontSize: 12,
      fontWeight: "400",
    },
    nutrientPct: {
      fontSize: 13,
      fontWeight: "600",
    },
    barBg: {
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
      marginTop: 2,
    },
    barFill: {
      height: "100%",
      borderRadius: 3,
    },
    noDataHint: {
      color: colors.secondary,
      textAlign: "center",
      marginVertical: 16,
    },
    closeButton: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    closeButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600",
    },
  });
