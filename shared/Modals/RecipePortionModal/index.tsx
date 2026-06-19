import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import BaseModal from "../BaseModal";

interface RecipePortionModalProps {
  isVisible: boolean;
  recipeName?: string;
  onSave: (grams: number) => void;
  onClose: () => void;
}

const RecipePortionModal = ({
  isVisible,
  recipeName,
  onSave,
  onClose,
}: RecipePortionModalProps) => {
  useColors();
  useThemedStyles(createStyles);
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setAmount("");
      setAmountError("");
    }
  }, [isVisible]);

  const handleSave = () => {
    const gramsVal = parseInt(amount || "0", 10);
    if (!amount.trim() || gramsVal <= 0) {
      setAmountError(t("recipe.gramsRequired"));
      return;
    }
    onSave(gramsVal);
    onClose();
  };

  return (
    <BaseModal
      isVisible={isVisible}
      title={recipeName}
      message={t("health.portionGramsMessage")}
      messageType="xs"
      onClose={onClose}
      buttons={[
        { title: t("common.save"), onPress: handleSave, variant: "primary" },
        { title: t("common.cancel"), onPress: onClose, variant: "secondary" },
      ]}
    >
      <TextInput
        placeholder={t("health.portionGramsPlaceholder")}
        keyboardType="numeric"
        value={amount}
        errorMessage={amountError}
        onChangeText={(v) => {
          setAmount(v.replace(/[^0-9]/g, ""));
          if (amountError) setAmountError("");
        }}
        autoFocus
      />
    </BaseModal>
  );
};

const createStyles = () => StyleSheet.create({});

export default RecipePortionModal;
