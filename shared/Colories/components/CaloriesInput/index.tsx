import { useAppSelector, useLazySearchRecipesQuery } from "@/api";
import type { RecipeResponse } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useIsCheatMealDay } from "@/hooks/useCheatMealDay";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import CardsCarousel from "@/shared/CardCarousel";
import TimeInput from "@/shared/Colories/components/TimeInput";
import TextInput from "@/shared/Inputs/TextInput";
import RecipePortionModal from "@/shared/Modals/RecipePortionModal";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import {
  filterCheatMealRecipes,
  getRecipesAsMealData,
  normalizeRecipes,
} from "@/widgets/Home/utils/data";
import { appSettingsStorage } from "@/storage/appSettings/appSettingsStorage";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { createCaloriesInputStyles } from "./styles";

type InputMode = "manual" | "search";

export interface TrackingAddParams {
  foodName: string;
  calories: number;
  recipeId?: number;
  time24h?: string;
  grams?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
}

interface CalorieInputProps {
  onAdd: (params: TrackingAddParams) => void;
}

/** Strip non-numeric/decimal characters; allow at most one dot */
function sanitizeDecimal(raw: string): string {
  return raw.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
}

const CalorieInput: React.FC<CalorieInputProps> = ({ onAdd }) => {
  const colors = useColors();
  const styles = useThemedStyles(createCaloriesInputStyles);
  const nutritionStyles = useThemedStyles(createNutritionStyles);
  const { t } = useTranslation();
  const [mode, setMode] = useState<InputMode>("manual");
  const [foodName, setFoodName] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [proteins, setProteins] = useState<string>("");
  const [fats, setFats] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [searchText, setSearchText] = useState("");

  // Recipe selection: map recipeId → { recipe, grams }
  const [selectedRecipes, setSelectedRecipes] = useState<
    Map<number, { recipe: RecipeResponse; grams: number }>
  >(new Map());

  // Portion modal state
  const [portionModalRecipe, setPortionModalRecipe] = useState<RecipeResponse | null>(null);

  const timeRef = useRef<string | undefined>(undefined);

  const isCheatMealDay = useIsCheatMealDay();
  const cheatMealIds = useAppSelector((state) => state.user.profile?.cheatMeal);
  const cheatMealSet = useMemo(() => new Set(cheatMealIds), [cheatMealIds]);

  const [searchRecipes, { data: recipes }] = useLazySearchRecipesQuery();

  const recipesArray = useMemo(() => {
    const normalized = normalizeRecipes(recipes);
    return filterCheatMealRecipes(normalized, cheatMealSet, isCheatMealDay);
  }, [recipes, cheatMealSet, isCheatMealDay]);

  const recipesAsMealData = getRecipesAsMealData(recipesArray);

  const nutrientTrackingEnabled = appSettingsStorage.isNutrientTrackingEnabled();

  const handleAdd = () => {
    const time = timeRef.current;
    if (mode === "manual" && foodName && calories) {
      onAdd({
        foodName,
        calories: parseInt(calories),
        time24h: time,
        proteins: nutrientTrackingEnabled
          ? proteins
            ? parseFloat(proteins)
            : undefined
          : 0,
        fats: nutrientTrackingEnabled
          ? fats
            ? parseFloat(fats)
            : undefined
          : 0,
        carbs: nutrientTrackingEnabled
          ? carbs
            ? parseFloat(carbs)
            : undefined
          : 0,
      });
      setFoodName("");
      setCalories("");
      setProteins("");
      setFats("");
      setCarbs("");
    } else if (mode === "search" && selectedRecipes.size > 0) {
      selectedRecipes.forEach(({ recipe, grams }) => {
        onAdd({
          foodName: recipe.name,
          calories: recipe.calories,
          recipeId: recipe.id,
          time24h: time,
          grams,
        });
      });
      setSelectedRecipes(new Map());
      setSearchText("");
    }
  };

  const handleToggleMode = () => {
    setMode(mode === "manual" ? "search" : "manual");
    setSelectedRecipes(new Map());
    setSearchText("");
  };

  // When user taps a recipe card: open portion modal if not selected; deselect if already selected
  const handleRecipeCardPress = useCallback(
    (recipe: RecipeResponse) => {
      if (selectedRecipes.has(recipe.id)) {
        setSelectedRecipes((prev) => {
          const next = new Map(prev);
          next.delete(recipe.id);
          return next;
        });
      } else {
        setPortionModalRecipe(recipe);
      }
    },
    [selectedRecipes]
  );

  const handlePortionConfirm = (grams: number) => {
    if (!portionModalRecipe) return;
    setSelectedRecipes((prev) => {
      const next = new Map(prev);
      next.set(portionModalRecipe.id, { recipe: portionModalRecipe, grams });
      return next;
    });
    setPortionModalRecipe(null);
  };

  const handleRemoveSelectedRecipe = (recipeId: number) => {
    setSelectedRecipes((prev) => {
      const next = new Map(prev);
      next.delete(recipeId);
      return next;
    });
  };

  const selectedRecipeNames = useMemo(
    () => Array.from(selectedRecipes.values()).map(({ recipe }) => recipe.name),
    [selectedRecipes]
  );

  return (
    <>
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="body" color="text">{t("health.tracking")}</ThemedText>
          <TouchableOpacity
            onPress={handleToggleMode}
            style={styles.toggleButton}
          >
            <Ionicons name="repeat" size={16} color={colors.primary} />
            <ThemedText type="xs" style={{ color: colors.primary }}>
              {mode === "manual"
                ? t("health.recipeFromFluff")
                : t("health.yourOwnRecipe")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          {mode === "manual" ? (
            <>
              <TextInput
                label={t("health.foodName")}
                placeholder={t("health.foodNamePlaceholder")}
                value={foodName}
                placeholderTextColor={colors.secondary}
                onChangeText={setFoodName}
              />
              <TextInput
                label={t("health.calories")}
                placeholder={t("health.caloriesPlaceholder")}
                placeholderTextColor={colors.secondary}
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
              />
              {nutrientTrackingEnabled ? (
                <>
                  <ThemedText type="xs" color="text" style={[nutritionStyles.sectionLabel]}>
                    {t("health.macros")}
                  </ThemedText>
                  <View style={nutritionStyles.nutritionGrid}>
                    <View style={nutritionStyles.nutritionCell}>
                      <TextInput
                        label={t("health.proteins")}
                        placeholder={t("health.proteinsPlaceholder")}
                        placeholderTextColor={colors.secondary}
                        keyboardType="decimal-pad"
                        value={proteins}
                        onChangeText={(v) => setProteins(sanitizeDecimal(v))}
                      />
                    </View>
                    <View style={nutritionStyles.nutritionCell}>
                      <TextInput
                        label={t("health.fats")}
                        placeholder={t("health.fatsPlaceholder")}
                        placeholderTextColor={colors.secondary}
                        keyboardType="decimal-pad"
                        value={fats}
                        onChangeText={(v) => setFats(sanitizeDecimal(v))}
                      />
                    </View>
                    <View style={nutritionStyles.nutritionCell}>
                      <TextInput
                        label={t("health.carbs")}
                        placeholder={t("health.carbsPlaceholder")}
                        placeholderTextColor={colors.secondary}
                        keyboardType="decimal-pad"
                        value={carbs}
                        onChangeText={(v) => setCarbs(sanitizeDecimal(v))}
                      />
                    </View>
                  </View>
                </>
              ) : null}
            </>
          ) : (
            <>
              <SearchInput
                style={styles.searchInput}
                isFiltering={selectedRecipes.size > 0}
                searchText={searchText}
                selectedFilters={selectedRecipeNames}
                onSearchChange={setSearchText}
                onToggleFilter={() => searchRecipes({ q: searchText })}
                onFilterRemove={(filterName) => {
                  const entry = Array.from(selectedRecipes.values()).find(
                    ({ recipe }) => recipe.name === filterName
                  );
                  if (entry) handleRemoveSelectedRecipe(entry.recipe.id);
                }}
              />
              {recipes && recipesArray.length > 0 && (
                <CardsCarousel
                  products={recipesAsMealData.map((meal) => ({
                    ...meal,
                    isLiked: selectedRecipes.has(Number(meal.id)),
                  }))}
                  onCardPress={(item) => {
                    const recipe = recipesArray.find(
                      (r) => r.id.toString() === item.id
                    );
                    if (recipe) handleRecipeCardPress(recipe);
                  }}
                  variant="mealsToday"
                />
              )}
            </>
          )}

          <TimeInput onChange={(t) => { timeRef.current = t; }} />
        </View>

        <Button
          style={{ zIndex: 1, elevation: 1 }}
          onPress={handleAdd}
          title={t("health.add")}
          disabled={
            (mode === "manual" && (!foodName || !calories)) ||
            (mode === "search" && selectedRecipes.size === 0)
          }
        />
      </GradientView>

      <RecipePortionModal
        isVisible={portionModalRecipe !== null}
        recipeName={portionModalRecipe?.name}
        onSave={handlePortionConfirm}
        onClose={() => setPortionModalRecipe(null)}
      />
    </>
  );
};

const createNutritionStyles = (colors: AppColors) =>
  StyleSheet.create({
    sectionLabel: {
      marginTop: 4,
      alignSelf: "flex-start",
      marginBottom: -4,
    },
    nutritionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    nutritionCell: {
      width: "47%",
    },
  });

export default CalorieInput;
