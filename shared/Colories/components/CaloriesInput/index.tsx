import { useAppSelector, useLazySearchRecipesQuery } from "@/api";
import type { RecipeResponse } from "@/api/types";
import { useColors } from "@/contexts/ThemeContext";
import { useIsCheatMealDay } from "@/hooks/useCheatMealDay";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import CardsCarousel from "@/shared/CardCarousel";
import TimeInput from "@/shared/Colories/components/TimeInput";
import TextInput from "@/shared/Inputs/TextInput";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import {
  filterCheatMealRecipes,
  getRecipesAsMealData,
  normalizeRecipes,
} from "@/widgets/Home/utils/data";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { createCaloriesInputStyles } from "./styles";

type InputMode = "manual" | "search";

interface CalorieInputProps {
  onAdd: (
    foodName: string,
    calories: number,
    recipeId?: number,
    time24h?: string
  ) => void;
}

const CalorieInput: React.FC<CalorieInputProps> = ({ onAdd }) => {
  const colors = useColors();
  const styles = useThemedStyles(createCaloriesInputStyles);
  const { t } = useTranslation();
  const [mode, setMode] = useState<InputMode>("manual");
  const [foodName, setFoodName] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState<RecipeResponse[]>([]);
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

  const handleAdd = () => {
    const time = timeRef.current;
    if (mode === "manual" && foodName && calories) {
      onAdd(foodName, parseInt(calories), undefined, time);
      setFoodName("");
      setCalories("");
    } else if (mode === "search" && selectedRecipes.length > 0) {
      selectedRecipes.forEach((recipe) => {
        onAdd(recipe.name, recipe.calories, recipe.id, time);
      });
      setSelectedRecipes([]);
      setSearchText("");
    }
  };

  const handleToggleMode = () => {
    setMode(mode === "manual" ? "search" : "manual");
    setSelectedRecipes([]);
    setSearchText("");
  };

  const handleRecipeSelect = useCallback(
    (recipe: RecipeResponse) => {
      if (selectedRecipes.find((r) => r.id === recipe.id)) {
        setSelectedRecipes(selectedRecipes.filter((r) => r.id !== recipe.id));
      } else {
        setSelectedRecipes([...selectedRecipes, recipe]);
      }
    },
    [selectedRecipes]
  );

  const handleRemoveSelectedRecipe = (recipeId: number) => {
    setSelectedRecipes(selectedRecipes.filter((r) => r.id !== recipeId));
  };

  return (
    <GradientView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="xs">{t("health.dailyCalorieIntake")}</ThemedText>
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
          </>
        ) : (
          <>
            <SearchInput
              style={styles.searchInput}
              isFiltering={selectedRecipes.length > 0}
              searchText={searchText}
              selectedFilters={selectedRecipes.map((r) => r.name)}
              onSearchChange={setSearchText}
              onToggleFilter={() => searchRecipes({ q: searchText })}
              onFilterRemove={(filterName) => {
                const recipe = selectedRecipes.find(
                  (r) => r.name === filterName
                );
                if (recipe) {
                  handleRemoveSelectedRecipe(recipe.id);
                }
              }}
            />
            {recipes && recipesArray.length > 0 && (
              <CardsCarousel
                products={recipesAsMealData.map((meal) => ({
                  ...meal,
                  isLiked: selectedRecipes.some(
                    (r) => r.id.toString() === meal.id
                  ),
                }))}
                onCardPress={(item) => {
                  const recipe = recipesArray.find(
                    (r) => r.id.toString() === item.id
                  );
                  if (recipe) {
                    handleRecipeSelect(recipe);
                  }
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
          (mode === "search" && selectedRecipes.length === 0)
        }
      />
    </GradientView>
  );
};

export default CalorieInput;
