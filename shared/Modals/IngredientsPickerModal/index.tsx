import type { ProductResponse } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import type { SelectedProduct } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import CardsCarousel, { MealData } from "@/shared/CardCarousel";
import { AddProductCardAction } from "@/shared/CardCarousel/cardActions";
import { ThemedText } from "@/shared/ui/ThemedText";
import { getProductsAsMealData } from "@/widgets/Home/utils/data";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { Feather } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface IngredientsPickerModalProps {
  isVisible: boolean;
  searchText: string;
  results: ProductResponse[];
  isFetching: boolean;
  selectedProducts: SelectedProduct[];
  onSearchChange: (text: string) => void;
  onClose: () => void;
  onAdd: (product: ProductResponse) => void;
}

const IngredientsPickerModal = ({
  isVisible,
  searchText,
  results,
  isFetching,
  selectedProducts,
  onSearchChange,
  onClose,
  onAdd,
}: IngredientsPickerModalProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const productsAsMealData = useMemo(() => getProductsAsMealData(results), [results]);

  const handleAdd = useCallback(
    (item: MealData) => {
      const product = results.find((p) => p.id === item.productId);
      if (product) onAdd(product);
    },
    [results, onAdd],
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={[styles.sheetInner, { backgroundColor: colors.background }]}>
            <View style={styles.sheetHeader}>
              <ThemedText type="subtitle">{t("recipe.ingredients")}</ThemedText>
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Feather name="x" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <SearchInput
              searchText={searchText}
              onSearchChange={onSearchChange}
              style={styles.sheetSearch}
            />

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {isFetching ? (
                <ActivityIndicator color={colors.primary} style={styles.loader} />
              ) : results.length === 0 && searchText.length > 0 ? (
                <ThemedText type="xs" style={styles.emptyText}>
                  {t("recipe.noProductsFound")}
                </ThemedText>
              ) : productsAsMealData.length > 0 ? (
                <CardsCarousel
                  products={productsAsMealData}
                  variant="featured"
                  onCardPress={() => {}}
                  renderCardRightAction={(item) => (
                    <AddProductCardAction
                      label={t("recipe.addProduct")}
                      added={selectedProducts.some((p) => p.id === item.productId)}
                      onAdd={() => handleAdd(item)}
                    />
                  )}
                />
              ) : null}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    sheetBackdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: { height: "72%" },
    sheetInner: {
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      gap: 16,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    sheetSearch: { marginTop: 0, marginBottom: 8 },
    loader: { paddingVertical: 16 },
    emptyText: { textAlign: "center", paddingVertical: 16 },
  });

export default IngredientsPickerModal;
