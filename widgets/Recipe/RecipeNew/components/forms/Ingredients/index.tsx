import { useLazySearchProductsQuery } from "@/api/slices/productsApi";
import type { ProductResponse } from "@/api/types";
import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { DEFAULT_PRODUCT_UNIT, getProductUnitLabel } from "@/constants/productUnits";
import type { CustomProduct, ProductUnit, SelectedProduct } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import IngredientsPickerModal from "@/shared/Modals/IngredientsPickerModal";
import ProductAmountModal from "@/shared/Modals/ProductAmountModal";
import { ThemedText } from "@/shared/ui/ThemedText";
import FilterTags from "@/widgets/Search/components/FilterTags";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { useCallback, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Keyboard, TouchableOpacity, View } from "react-native";

import CustomProductForm from "./components/CustomProductForm";
import { createIngredientsStyles } from "./styles";
import { getFormError } from "@/widgets/Recipe/RecipeNew/utils/getFormError";

const DEBOUNCE_MS = 400;

const Ingredients = ({ onBack }: { onBack: () => void }) => {
  const colors = useColors();
  const styles = useThemedStyles(createIngredientsStyles);
  const { t } = useTranslation();
  const { watch, setValue, formState: { errors } } = useFormContext();

  const selectedProducts: SelectedProduct[] = watch("selectedProducts") || [];
  const customProducts: CustomProduct[] = watch("customProducts") || [];

  const [sheetVisible, setSheetVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [triggerSearch, { data: searchResults, isFetching }] = useLazySearchProductsQuery();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalProduct, setModalProduct] = useState<ProductResponse | null>(null);
  const [gramsInput, setGramsInput] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit>(DEFAULT_PRODUCT_UNIT);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (text.trim().length >= 1) triggerSearch({ q: text.trim() });
      }, DEBOUNCE_MS);
    },
    [triggerSearch],
  );

  const closeSheet = () => {
    Keyboard.dismiss();
    setSheetVisible(false);
    setSearchText("");
  };

  const openGramsModal = (product: ProductResponse) => {
    const existing = selectedProducts.find((p) => p.id === product.id);
    setGramsInput(existing?.grams ? String(existing.grams) : "");
    setSelectedUnit(existing?.unit ?? DEFAULT_PRODUCT_UNIT);
    setModalProduct(product);
  };

  const handleSaveProduct = () => {
    if (!modalProduct) return;
    const qty = gramsInput.trim() ? parseInt(gramsInput, 10) : undefined;
    if (!qty || qty <= 0) return;
    const entry: SelectedProduct = {
      id: modalProduct.id,
      name: modalProduct.name,
      grams: qty,
      unit: selectedUnit,
      calories: modalProduct.calories,
      image: modalProduct.image,
    };
    const idx = selectedProducts.findIndex((p) => p.id === entry.id);
    const updated =
      idx >= 0
        ? selectedProducts.map((p, i) => (i === idx ? entry : p))
        : [...selectedProducts, entry];
    setValue("selectedProducts", updated, { shouldValidate: true });
    setModalProduct(null);
  };

  const removeSelected = (id: number) =>
    setValue(
      "selectedProducts",
      selectedProducts.filter((p) => p.id !== id),
      { shouldValidate: true },
    );

  const addCustomProduct = (product: CustomProduct) =>
    setValue("customProducts", [...customProducts, product], { shouldValidate: true });

  const removeCustomProduct = (index: number) =>
    setValue(
      "customProducts",
      customProducts.filter((_, i) => i !== index),
      { shouldValidate: true },
    );

  const results = Array.isArray(searchResults) ? searchResults : [];

  const formatSelectedLabel = (p: SelectedProduct) =>
    `${p.name}${p.grams !== undefined ? ` · ${p.grams} ${getProductUnitLabel(p.unit ?? DEFAULT_PRODUCT_UNIT, t)}` : ""}`;

  const ingredientsError = getFormError(errors, "selectedProducts");

  return (
    <View>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <ThemedText type="subtitle">{t("recipe.ingredients")}</ThemedText>
        <ThemedText type="xs">{t("recipe.ingredientsHint")}</ThemedText>
      </View>

      <View style={styles.contentContainer}>
      <SearchInput
        isPlaceholder
        onPress={() => setSheetVisible(true)}
        style={styles.searchTrigger}
      />

      {selectedProducts.length > 0 && (
        <View style={styles.taggedSection}>
          <ThemedText type="s">{t("recipe.selectedProducts")}</ThemedText>
          <FilterTags
            filters={selectedProducts.map(formatSelectedLabel)}
            onRemove={(label) => {
              const product = selectedProducts.find((p) => formatSelectedLabel(p) === label);
              if (product) removeSelected(product.id);
            }}
            variant="input"
          />
        </View>
      )}

      <CustomProductForm
        customProducts={customProducts}
        onAdd={addCustomProduct}
        onRemove={removeCustomProduct}
        styles={styles}
      />

      {ingredientsError ? (
        <ThemedText type="xs" style={styles.fieldError}>
          {ingredientsError}
        </ThemedText>
      ) : null}

      <IngredientsPickerModal
        isVisible={sheetVisible}
        searchText={searchText}
        results={results}
        isFetching={isFetching}
        selectedProducts={selectedProducts}
        onSearchChange={handleSearchChange}
        onClose={closeSheet}
        onAdd={openGramsModal}
      />

      <ProductAmountModal
        isVisible={!!modalProduct}
        productName={modalProduct?.name}
        amount={gramsInput}
        selectedUnit={selectedUnit}
        onChangeAmount={setGramsInput}
        onChangeUnit={setSelectedUnit}
        onSave={handleSaveProduct}
          onClose={() => setModalProduct(null)}
        />
      </View>
    </View>
  );
};

export default Ingredients;
