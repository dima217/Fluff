import { DEFAULT_PRODUCT_UNIT, getProductUnitLabel } from "@/constants/productUnits";
import type { CustomProduct, ProductUnit } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import ProductAmountModal from "@/shared/Modals/ProductAmountModal";
import Circle from "@/shared/ui/Circle";
import { ThemedText } from "@/shared/ui/ThemedText";
import FilterTags from "@/widgets/Search/components/FilterTags";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";

import type { IngredientsStyles } from "../../styles";

interface CustomProductFormProps {
  customProducts: CustomProduct[];
  onAdd: (product: CustomProduct) => void;
  onRemove: (index: number) => void;
  styles: IngredientsStyles;
}

const CustomProductForm = ({
  customProducts,
  onAdd,
  onRemove,
  styles,
}: CustomProductFormProps) => {
  const colors = useColors();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [gramsInput, setGramsInput] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit>(DEFAULT_PRODUCT_UNIT);

  const formatCustomLabel = (cp: CustomProduct) =>
    `${cp.name}${cp.grams ? ` · ${cp.grams} ${getProductUnitLabel(cp.unit ?? DEFAULT_PRODUCT_UNIT, t)}` : ""}`;

  const canAdd = name.trim().length > 0;

  const openModal = () => {
    setGramsInput("");
    setSelectedUnit(DEFAULT_PRODUCT_UNIT);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleSave = () => {
    if (!canAdd) return;
    const parsedGrams = gramsInput.trim() ? parseInt(gramsInput, 10) : undefined;
    onAdd({ name: name.trim(), grams: parsedGrams, unit: selectedUnit });
    setName("");
    closeModal();
  };

  return (
    <View style={styles.taggedSection}>
      <ThemedText type="s">{t("recipe.customProducts")}</ThemedText>

      <TextInput
        placeholder={t("recipe.customProductName")}
        value={name}
        onChangeText={setName}
        label={t("recipe.customProductName")}
        inputContainerStyle={[{paddingRight: 4}]}
        right={ 
          <Circle
            color={canAdd ? colors.primary : colors.inactive}
            onPress={canAdd ? openModal : undefined}
            svg={<Feather name="plus" size={22} color={colors.onPrimary} />}
          />
        }
      />

      <FilterTags
        filters={customProducts.map(formatCustomLabel)}
        onRemove={(label) => {
          const index = customProducts.findIndex((cp) => formatCustomLabel(cp) === label);
          if (index >= 0) onRemove(index);
        }}
        variant="input"
      />

      <ProductAmountModal
        isVisible={modalVisible}
        productName={name.trim()}
        amount={gramsInput}
        selectedUnit={selectedUnit}
        onChangeAmount={setGramsInput}
        onChangeUnit={setSelectedUnit}
        onSave={handleSave}
        onClose={closeModal}
      />
    </View>
  );
};

export default CustomProductForm;