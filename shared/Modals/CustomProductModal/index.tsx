import { AppColors } from "@/constants/design-tokens";
import { getProductUnitLabel } from "@/constants/productUnits";
import type { ProductUnit } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import ActionSheet from "@/shared/ui/ActionSheet";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BaseModal from "../BaseModal";

interface CustomProductModalProps {
  isVisible: boolean;
  productName?: string;
  amount: string;
  selectedUnit: ProductUnit;
  calories: string;
  proteins: string;
  fats: string;
  carbs: string;
  onChangeAmount: (v: string) => void;
  onChangeUnit: (u: ProductUnit) => void;
  onChangeCalories: (v: string) => void;
  onChangeProteins: (v: string) => void;
  onChangeFats: (v: string) => void;
  onChangeCarbs: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

function clampNumeric(raw: string, max: number): string {
  const cleaned = raw.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return cleaned;
  if (num > max) return String(max);
  return cleaned;
}

const CustomProductModal = ({
  isVisible,
  productName,
  amount,
  selectedUnit,
  calories,
  proteins,
  fats,
  carbs,
  onChangeAmount,
  onChangeUnit,
  onChangeCalories,
  onChangeProteins,
  onChangeFats,
  onChangeCarbs,
  onSave,
  onClose,
}: CustomProductModalProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const [unitSheetVisible, setUnitSheetVisible] = useState(false);
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    if (!isVisible) setAmountError("");
  }, [isVisible]);

  const gramsVal = parseInt(amount || "0", 10);
  const isAmountValid = amount.trim().length > 0 && gramsVal > 0;
  const maxCalories = Math.max(gramsVal * 9, 0);
  const maxMacro = Math.max(gramsVal, 0);

  const proteinsNum = parseFloat(proteins || "0");
  const fatsNum = parseFloat(fats || "0");
  const carbsNum = parseFloat(carbs || "0");
  const macroSumExceeds = gramsVal > 0 && proteinsNum + fatsNum + carbsNum > gramsVal;

  const handleSave = () => {
    if (!isAmountValid) {
      setAmountError(t("recipe.gramsRequired"));
      return;
    }
    if (macroSumExceeds) return;
    onSave();
  };

  return (
    <>
      <BaseModal
        isVisible={isVisible}
        title={productName}
        message={t("recipe.gramsInputMessage")}
        messageType="xs"
        onClose={onClose}
        buttons={[
          { title: t("common.save"), onPress: handleSave, variant: "primary" },
          { title: t("common.cancel"), onPress: onClose, variant: "secondary" },
        ]}
      >
        <View style={styles.fields}>
          {/* Amount with unit picker */}
          <TextInput
            inputContainerStyle={styles.amountInputContainer}
            placeholder={t("recipe.gramsPlaceholder")}
            keyboardType="numeric"
            value={amount}
            errorMessage={amountError}
            onChangeText={(v) => {
              onChangeAmount(v.replace(/[^0-9]/g, ""));
              if (amountError) setAmountError("");
            }}
            autoFocus
            right={
              <TouchableOpacity
                onPress={() => setUnitSheetVisible(true)}
                style={styles.unitButton}
              >
                <Text style={[styles.unitText, { color: colors.text }]}>
                  {getProductUnitLabel(selectedUnit, t)}
                </Text>
                <Ionicons name="chevron-down" size={14} color={colors.secondary} />
              </TouchableOpacity>
            }
          />

          {/* Nutrition section */}
          <View style={styles.nutritionHeader}>
            <ThemedText type="s">{t("recipe.customProductNutrition")}</ThemedText>
            <ThemedText type="xs" style={{ color: colors.secondary }}>
              {t("recipe.customProductNutritionHint")}
            </ThemedText>
          </View>

          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionCell}>
              <TextInput
                label={t("recipe.caloriesLabel")}
                placeholder="0"
                keyboardType="decimal-pad"
                value={calories}
                onChangeText={(v) =>
                  onChangeCalories(clampNumeric(v, maxCalories || 99999))
                }
              />
            </View>
            <View style={styles.nutritionCell}>
              <TextInput
                label={t("recipe.proteinsLabel")}
                placeholder="0"
                keyboardType="decimal-pad"
                value={proteins}
                onChangeText={(v) => onChangeProteins(clampNumeric(v, maxMacro))}
              />
            </View>
            <View style={styles.nutritionCell}>
              <TextInput
                label={t("recipe.fatsLabel")}
                placeholder="0"
                keyboardType="decimal-pad"
                value={fats}
                onChangeText={(v) => onChangeFats(clampNumeric(v, maxMacro))}
              />
            </View>
            <View style={styles.nutritionCell}>
              <TextInput
                label={t("recipe.carbsLabel")}
                placeholder="0"
                keyboardType="decimal-pad"
                value={carbs}
                onChangeText={(v) => onChangeCarbs(clampNumeric(v, maxMacro))}
              />
            </View>
          </View>

          {macroSumExceeds && (
            <ThemedText type="xs" style={styles.errorText}>
              {t("recipe.nutritionExceedsWeight")}
            </ThemedText>
          )}
        </View>
      </BaseModal>

      <ActionSheet
        isVisible={unitSheetVisible}
        title={t("recipe.selectUnit")}
        cancelLabel={t("common.cancel")}
        options={[
          { label: t("recipe.gramsUnit"), onPress: () => onChangeUnit("г") },
          { label: t("recipe.pcsUnit"), onPress: () => onChangeUnit("шт") },
        ]}
        onClose={() => setUnitSheetVisible(false)}
      />
    </>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    fields: {
      gap: 12,
    },
    amountInputContainer: {
      paddingRight: 4,
    },
    unitButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    unitText: {
      fontSize: 15,
      fontWeight: "500",
    },
    nutritionHeader: {
      gap: 2,
      marginTop: 4,
    },
    nutritionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    nutritionCell: {
      width: "47%",
    },
    errorText: {
      color: colors.reject,
      textAlign: "center",
    },
  });

export default CustomProductModal;
