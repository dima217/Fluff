import type { ProductUnit } from "@/constants/types";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import ProductUnitSegment from "@/shared/ProductUnitSegment";
import { StyleSheet, View } from "react-native";
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
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <BaseModal
      isVisible={isVisible}
      title={productName}
      message={t("recipe.gramsInputMessage")}
      messageType="xs"
      onClose={onClose}
      buttons={[
        {
          title: t("common.save"),
          onPress: onSave,
          variant: "primary",
        },
        {
          title: t("common.cancel"),
          onPress: onClose,
          variant: "secondary",
        },
      ]}
    >
      <View style={styles.fields}>
        <TextInput
          placeholder={t("recipe.gramsPlaceholder")}
          keyboardType="numeric"
          value={amount}
          onChangeText={(v) => onChangeAmount(v.replace(/[^0-9]/g, ""))}
          autoFocus
        />
        <ProductUnitSegment value={selectedUnit} onChange={onChangeUnit} />
      </View>
    </BaseModal>
  );
};

const createStyles = () =>
  StyleSheet.create({
    fields: {
      gap: 12,
    },
  });

export default ProductAmountModal;
