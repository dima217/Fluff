import { getProductUnitLabel } from "@/constants/productUnits";
import type { ProductUnit } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import ActionSheet from "@/shared/ui/ActionSheet";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BaseModal from "../BaseModal";

interface ProductAmountModalProps {
  isVisible: boolean;
  productName?: string;
  amount: string;
  selectedUnit: ProductUnit;
  onChangeAmount: (value: string) => void;
  onChangeUnit: (unit: ProductUnit) => void;
  onSave: () => void;
  onClose: () => void;
}

const ProductAmountModal = ({
  isVisible,
  productName,
  amount,
  selectedUnit,
  onChangeAmount,
  onChangeUnit,
  onSave,
  onClose,
}: ProductAmountModalProps) => {
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

  const handleSave = () => {
    if (!isAmountValid) {
      setAmountError(t("recipe.gramsRequired"));
      return;
    }
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

const createStyles = () =>
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
  });

export default ProductAmountModal;
