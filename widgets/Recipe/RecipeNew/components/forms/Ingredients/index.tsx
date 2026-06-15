import { useLazySearchProductsQuery } from "@/api/slices/productsApi";
import type { ProductResponse } from "@/api/types";
import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { AppColors } from "@/constants/design-tokens";
import type { CustomProduct, ProductUnit, SelectedProduct } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { Feather } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  Pressable,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DEBOUNCE_MS = 400;

/* ─── Main component ────────────────────────────────────────────── */

const Ingredients = ({ onBack }: { onBack: () => void }) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();

  const selectedProducts: SelectedProduct[] = watch("selectedProducts") || [];
  const customProducts: CustomProduct[] = watch("customProducts") || [];

  const [sheetVisible, setSheetVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [triggerSearch, { data: searchResults, isFetching }] =
    useLazySearchProductsQuery();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalProduct, setModalProduct] = useState<ProductResponse | null>(null);
  const [gramsInput, setGramsInput] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit>("г");

  const [customName, setCustomName] = useState("");
  const [customGrams, setCustomGrams] = useState("");
  const [customUnit, setCustomUnit] = useState<ProductUnit>("г");

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
    setSelectedUnit(existing?.unit ?? "г");
    setModalProduct(product);
  };

  const handleSaveProduct = () => {
    if (!modalProduct) return;
    const qty = gramsInput.trim() ? parseInt(gramsInput, 10) : undefined;
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
    setValue("selectedProducts", updated);
    setModalProduct(null);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const grams = customGrams.trim() ? parseInt(customGrams, 10) : undefined;
    setValue("customProducts", [
      ...customProducts,
      { name: customName.trim(), grams, unit: customUnit },
    ]);
    setCustomName("");
    setCustomGrams("");
  };

  const removeSelected = (id: number) =>
    setValue(
      "selectedProducts",
      selectedProducts.filter((p) => p.id !== id),
    );

  const removeCustom = (i: number) =>
    setValue(
      "customProducts",
      customProducts.filter((_, idx) => idx !== i),
    );

  const results = Array.isArray(searchResults) ? searchResults : [];

  return (
    <View>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <ThemedText type="subtitle">{t("recipe.ingredients")}</ThemedText>
        <ThemedText type="xs">{t("recipe.ingredientsHint")}</ThemedText>
      </View>

      {/* Search trigger */}
      <SearchInput
        isPlaceholder
        onPress={() => setSheetVisible(true)}
        style={styles.searchTrigger}
      />

      {/* Selected DB products */}
      {selectedProducts.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="s">{t("recipe.selectedProducts")}</ThemedText>
          <View style={styles.tags}>
            {selectedProducts.map((p) => (
              <Chip
                key={p.id}
                label={`${p.name}${p.grams !== undefined ? ` · ${p.grams} ${p.unit ?? t("recipe.gramsUnit")}` : ""}`}
                onRemove={() => removeSelected(p.id)}
                colors={colors}
                styles={styles}
              />
            ))}
          </View>
        </View>
      )}

      {/* Custom products — временно скрыто */}
      {/* <View style={styles.section}>
        <ThemedText type="s">{t("recipe.customProducts")}</ThemedText>

        <View style={styles.customRow}>
          <RNTextInput
            style={[styles.customInput, { color: colors.text, borderColor: colors.border }]}
            placeholder={t("recipe.customProductName")}
            placeholderTextColor={colors.secondary}
            value={customName}
            onChangeText={setCustomName}
          />
          <RNTextInput
            style={[styles.customGramsInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="0"
            placeholderTextColor={colors.secondary}
            value={customGrams}
            onChangeText={(v) => setCustomGrams(v.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
          <View style={[styles.unitSegment, { backgroundColor: colors.inactive }]}>
            {(["г", "шт"] as ProductUnit[]).map((u) => (
              <TouchableOpacity
                key={u}
                style={[
                  styles.unitSegmentBtn,
                  u === customUnit && { backgroundColor: colors.primary },
                ]}
                onPress={() => setCustomUnit(u)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.unitSegmentText,
                    { color: u === customUnit ? colors.onPrimary : colors.secondary },
                  ]}
                >
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.customAddBtn,
              { backgroundColor: customName.trim() ? colors.primary : colors.inactive },
            ]}
            onPress={handleAddCustom}
            disabled={!customName.trim()}
          >
            <Feather name="plus" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>

        {customProducts.length > 0 && (
          <View style={styles.tags}>
            {customProducts.map((cp, i) => (
              <Chip
                key={i}
                label={`${cp.name}${cp.grams ? ` · ${cp.grams} ${cp.unit ?? "г"}` : ""}`}
                onRemove={() => removeCustom(i)}
                colors={colors}
                styles={styles}
              />
            ))}
          </View>
        )}
      </View> */}

      {/* Bottom sheet */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={closeSheet}>
        <Pressable style={styles.sheetBackdrop} onPress={closeSheet}>
          <Pressable style={styles.sheet}>
            <View style={[styles.sheetInner, { backgroundColor: colors.background }]}>
              <View style={styles.sheetHeader}>
                <ThemedText type="subtitle">{t("recipe.ingredients")}</ThemedText>
                <TouchableOpacity onPress={closeSheet} hitSlop={8}>
                  <Feather name="x" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>

              <SearchInput
                searchText={searchText}
                onSearchChange={handleSearchChange}
                style={styles.sheetSearch}
              />

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {isFetching ? (
                  <ActivityIndicator color={colors.primary} style={styles.loader} />
                ) : results.length === 0 && searchText.length > 0 ? (
                  <ThemedText type="xs" style={styles.emptyText}>
                    {t("recipe.noProductsFound")}
                  </ThemedText>
                ) : (
                  results.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      added={selectedProducts.some((p) => p.id === product.id)}
                      onAdd={() => openGramsModal(product)}
                      addLabel={t("recipe.addProduct")}
                      styles={styles}
                      colors={colors}
                    />
                  ))
                )}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Grams modal */}
      <Modal visible={!!modalProduct} transparent animationType="fade">
        <Pressable
          style={styles.gramsBackdrop}
          onPress={() => setModalProduct(null)}
        >
          <Pressable style={styles.gramsContainer}>
            <GradientView style={styles.gramsCard}>
              <ThemedText type="subtitle" style={styles.center}>
                {modalProduct?.name ?? ""}
              </ThemedText>
              <ThemedText type="xs" style={[styles.center, styles.gramsHint]}>
                {t("recipe.gramsInputMessage")}
              </ThemedText>

              <View style={styles.gramsRow}>
                <RNTextInput
                  style={[styles.gramsInput, { color: colors.text, borderColor: colors.border }]}
                  keyboardType="numeric"
                  placeholder={t("recipe.gramsPlaceholder")}
                  placeholderTextColor={colors.secondary}
                  value={gramsInput}
                  onChangeText={(v) => setGramsInput(v.replace(/[^0-9]/g, ""))}
                  autoFocus
                />

                {/* Unit segmented control */}
                <View style={[styles.unitSegment, { backgroundColor: colors.inactive }]}>
                  {(["г", "шт"] as ProductUnit[]).map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitSegmentBtn,
                        unit === selectedUnit && { backgroundColor: colors.primary },
                      ]}
                      onPress={() => setSelectedUnit(unit)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.unitSegmentText,
                          { color: unit === selectedUnit ? colors.onPrimary : colors.secondary },
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.gramsSave, { backgroundColor: colors.primary }]}
                onPress={handleSaveProduct}
              >
                <Text style={[styles.gramsBtnText, { color: colors.onPrimary }]}>
                  {t("common.save")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gramsCancel}
                onPress={() => setModalProduct(null)}
              >
                <Text style={[styles.gramsBtnText, { color: colors.reject }]}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
            </GradientView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

/* ─── Chip ──────────────────────────────────────────────────────── */

const Chip = ({
  label,
  onRemove,
  colors,
  styles,
}: {
  label: string;
  onRemove: () => void;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
}) => (
  <View style={[styles.chip, { backgroundColor: colors.card }]}>
    <Text style={[styles.chipText, { color: colors.text }]}>{label}</Text>
    <TouchableOpacity onPress={onRemove} hitSlop={6}>
      <Feather name="x" size={13} color={colors.secondary} />
    </TouchableOpacity>
  </View>
);

/* ─── ProductCard (carousel row style — matches MealCard) ───────── */

const ProductCard = ({
  product,
  added,
  onAdd,
  addLabel,
  styles,
  colors,
}: {
  product: ProductResponse;
  added: boolean;
  onAdd: () => void;
  addLabel: string;
  styles: ReturnType<typeof createStyles>;
  colors: AppColors;
}) => (
  <View style={[styles.card, { backgroundColor: colors.card }]}>
    {product.image?.cover ? (
      <Image source={{ uri: product.image.cover }} style={styles.cardImage} />
    ) : (
      <View style={[styles.cardImage, styles.cardImageFallback]}>
        <Feather name="image" size={20} color={colors.secondary} />
      </View>
    )}

    <View style={styles.cardBody}>
      <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={[styles.cardMeta, { color: colors.secondary }]}>
        {Math.round(product.calories)} ккал · {Math.round(product.massa)}г
      </Text>
      {product.isFluff && (
        <View style={[styles.fluffBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.fluffBadgeText, { color: colors.onPrimary }]}>Fluff</Text>
        </View>
      )}
    </View>

    <TouchableOpacity
      style={[styles.addBtn, { backgroundColor: added ? colors.inactive : colors.primary }]}
      onPress={onAdd}
    >
      <Text style={[styles.addBtnText, { color: colors.onPrimary }]}>{addLabel}</Text>
    </TouchableOpacity>
  </View>
);

/* ─── Styles ────────────────────────────────────────────────────── */

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    backButton: { paddingBottom: 10 },

    header: { gap: 6, marginBottom: 8 },

    searchTrigger: { marginTop: 0, marginBottom: 0 },

    section: { marginTop: 16, gap: 10 },

    tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

    chip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 6,
    },
    chipText: { fontSize: 13 },

    customRow: { flexDirection: "row", gap: 8, alignItems: "center" },
    customInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      borderWidth: 1,
    },
    customGramsInput: {
      width: 56,
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 10,
      fontSize: 14,
      borderWidth: 1,
      textAlign: "center",
    },
    customAddBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },

    // ── Bottom sheet ──────────────────────────────────────
    sheetBackdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      height: "72%",
    },
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

    // ── Product card (matches MealCard carousel variant) ──
    card: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      padding: 10,
      height: 80,
      gap: 10,
      marginBottom: 8,
    },
    cardImage: {
      width: 60,
      height: "100%",
      borderRadius: 10,
      overflow: "hidden",
      resizeMode: "cover",
    },
    cardImageFallback: {
      backgroundColor: colors.inactive,
      justifyContent: "center",
      alignItems: "center",
    },
    cardBody: { flex: 1, gap: 2 },
    cardName: { fontSize: 14, fontWeight: "600" },
    cardMeta: { fontSize: 12 },
    fluffBadge: {
      alignSelf: "flex-start",
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    fluffBadgeText: { fontSize: 10, fontWeight: "700" },
    addBtn: {
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    addBtnText: { fontSize: 13, fontWeight: "600" },

    // ── Grams modal ───────────────────────────────────────
    gramsBackdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    gramsContainer: { width: "85%" },
    gramsCard: {
      flex: 0,
      borderRadius: 20,
      padding: 24,
    },
    center: { textAlign: "center" },
    gramsHint: { opacity: 0.7, marginTop: 4, marginBottom: 20 },
    gramsRow: { flexDirection: "row", gap: 10, marginBottom: 20, alignItems: "center" },
    gramsInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      fontWeight: "600",
      borderWidth: 1,
    },
    unitSegment: {
      flexDirection: "row",
      borderRadius: 12,
      padding: 3,
      gap: 2,
    },
    unitSegmentBtn: {
      borderRadius: 9,
      paddingHorizontal: 14,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    unitSegmentText: { fontSize: 15, fontWeight: "700" },
    gramsSave: {
      borderRadius: 24,
      paddingVertical: 14,
      alignItems: "center",
      marginBottom: 8,
    },
    gramsCancel: { paddingVertical: 10, alignItems: "center" },
    gramsBtnText: { fontSize: 15, fontWeight: "600" },
  });

export default Ingredients;
