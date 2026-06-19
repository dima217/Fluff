import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import type { NutrientAmount } from "@/services/equation/consumedNutrients";
import { calculateNutrientProgress } from "@/services/equation/consumedNutrients";
import type { DailyNutrientNorms } from "@/services/equation/nutrients";
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

interface NutrientDetailsModalProps {
  isVisible: boolean;
  norms: DailyNutrientNorms | null;
  consumed: NutrientAmount;
  onClose: () => void;
}

const BADGE_COLORS = {
  calories: "#E95285",
  proteins: "#5B8AF5",
  fats: "#F5A623",
  carbs: "#33AD2D",
} as const;

const NutrientDetailsModal: React.FC<NutrientDetailsModalProps> = ({
  isVisible,
  norms,
  consumed,
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
        <Pressable style={styles.wrapper} onPress={() => {}}>
          <GradientView style={styles.card}>
            <View style={styles.header}>
              <ThemedText type="heading">{t("nutrition.nutrientDetailsTitle")}</ThemedText>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {norms ? (
              <>
                <ThemedText type="caption" style={styles.subtitle}>
                  {t("nutrition.nutrientDetailsSubtitle")}
                </ThemedText>

                <View style={styles.nutrientsList}>
                  <NutrientRow
                    label={t("health.calories")}
                    consumed={consumed.calories}
                    norm={norms.calories}
                    unit={t("health.caloriesUnit")}
                    color={BADGE_COLORS.calories}
                    styles={styles}
                    colors={colors}
                  />
                  <NutrientRow
                    label={t("nutrition.proteins")}
                    consumed={consumed.proteins}
                    norm={norms.proteins}
                    unit={t("nutrition.gUnit")}
                    color={BADGE_COLORS.proteins}
                    styles={styles}
                    colors={colors}
                  />
                  <NutrientRow
                    label={t("nutrition.fats")}
                    consumed={consumed.fats}
                    norm={norms.fats}
                    unit={t("nutrition.gUnit")}
                    color={BADGE_COLORS.fats}
                    styles={styles}
                    colors={colors}
                  />
                  <NutrientRow
                    label={t("nutrition.carbs")}
                    consumed={consumed.carbs}
                    norm={norms.carbs}
                    unit={t("nutrition.gUnit")}
                    color={BADGE_COLORS.carbs}
                    styles={styles}
                    colors={colors}
                  />
                </View>
              </>
            ) : (
              <ThemedText type="caption" style={styles.noDataHint}>
                {t("nutrition.noDataHint")}
              </ThemedText>
            )}
          </GradientView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

interface NutrientRowProps {
  label: string;
  consumed: number;
  norm: number;
  unit: string;
  color: string;
  styles: ReturnType<typeof createStyles>;
  colors: AppColors;
}

const NutrientRow: React.FC<NutrientRowProps> = ({
  label,
  consumed,
  norm,
  unit,
  color,
  styles,
  colors,
}) => {
  const percentage = calculateNutrientProgress(consumed, norm);
  const displayConsumed = Number.isInteger(consumed)
    ? consumed
    : Math.round(consumed * 10) / 10;
  const displayNorm = Math.round(norm);

  return (
    <View style={styles.nutrientRow}>
      <View style={styles.nutrientLeft}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.nutrientLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={styles.nutrientRight}>
        <Text style={[styles.nutrientValue, { color: colors.text }]}>
          {displayConsumed}
          <Text style={[styles.nutrientUnit, { color: colors.secondary }]}>
            {" / "}
            {displayNorm} {unit}
          </Text>
        </Text>
        <Text style={[styles.nutrientPct, { color }]}>{Math.round(percentage)}%</Text>
      </View>
      <View style={[styles.barBg, { backgroundColor: colors.inactive }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

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
      alignSelf: "center",
    },
    card: {
      borderRadius: 20,
      padding: 24,
      flex: 0,
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    subtitle: {
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
