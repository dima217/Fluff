import { useLazySearchProductsQuery, useLazySearchRecipesQuery } from "@/api";
import type { RecipeResponse } from "@/api/types";
import { Colors } from "@/constants/design-tokens";
import { useExcludeCheatMealRecipeIds } from "@/hooks/useCheatMealDay";
import Button from "@/shared/Buttons/Button";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import TextInput from "@/shared/Inputs/TextInput";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

type InputMode = "manual" | "search";

interface CalorieInputProps {
  onAdd: (foodName: string, calories: number, recipeId?: number) => void;
}

const CalorieInput: React.FC<CalorieInputProps> = ({ onAdd }) => {
  const [mode, setMode] = useState<InputMode>("manual");
  const [foodName, setFoodName] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState<RecipeResponse[]>([]);

  // When today is cheat meal day, exclude cheat meal recipes from search results
  const excludeCheatMealIds = useExcludeCheatMealRecipeIds();

  // Lazy queries for search
  const [searchRecipes, { data: recipes }] = useLazySearchRecipesQuery();
  const [searchProducts] = useLazySearchProductsQuery();

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Perform search when debounced text changes
  useEffect(() => {
    if (mode === "search" && debouncedSearchText.trim().length > 0) {
      searchRecipes({ q: debouncedSearchText });
      searchProducts({ q: debouncedSearchText });
    }
  }, [debouncedSearchText, mode, searchRecipes, searchProducts]);

  const recipesArray = useMemo(() => {
    console.log("excludeCheatMealIds", excludeCheatMealIds);
    if (!recipes) return [];
    let list: RecipeResponse[] = [];
    if (Array.isArray(recipes)) list = recipes;
    else if (typeof recipes === "object" && "data" in recipes) {
      list = Array.isArray(recipes.data) ? recipes.data : [];
    }
    if (excludeCheatMealIds.size === 0) return list;
    return list.filter((r) => !excludeCheatMealIds.has(r.id));
  }, [recipes, excludeCheatMealIds]);

  // Convert recipes to MealData format for CardCarousel
  const recipesAsMealData: MealData[] = useMemo(() => {
    return recipesArray.map((recipe) => ({
      id: recipe.id.toString(),
      title: recipe.name,
      calories: `${recipe.calories} ккал`,
      imageUrl: recipe.image?.cover || recipe.image?.preview || "",
      isLiked: recipe.favorite,
      recipeId: recipe.id,
    }));
  }, [recipesArray]);

  const handleAdd = () => {
    if (mode === "manual" && foodName && calories) {
      onAdd(foodName, parseInt(calories));
      setFoodName("");
      setCalories("");
    } else if (mode === "search" && selectedRecipes.length > 0) {
      selectedRecipes.forEach((recipe) => {
        onAdd(recipe.name, recipe.calories, recipe.id);
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

  const handleRecipeSelect = (recipe: RecipeResponse) => {
    if (selectedRecipes.find((r) => r.id === recipe.id)) {
      setSelectedRecipes(selectedRecipes.filter((r) => r.id !== recipe.id));
    } else {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const handleRemoveSelectedRecipe = (recipeId: number) => {
    setSelectedRecipes(selectedRecipes.filter((r) => r.id !== recipeId));
  };

  return (
    <GradientView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="xs">Daily calorie intake</ThemedText>
        <TouchableOpacity
          onPress={handleToggleMode}
          style={styles.toggleButton}
        >
          <Ionicons name="repeat" size={16} color={Colors.primary} />
          <ThemedText type="xs" style={{ color: Colors.primary }}>
            {mode === "manual" ? "Recipe from Fluff" : "Your own recipe"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        {mode === "manual" ? (
          <>
            <TextInput
              label="Food Name"
              placeholder="Example: Banana, Chicken Breast"
              value={foodName}
              onChangeText={setFoodName}
            />
            <TextInput
              label="Calories"
              placeholder="Example: 95"
              placeholderTextColor="#888"
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
              onToggleFilter={() => {}}
              onFilterRemove={(filterName) => {
                const recipe = selectedRecipes.find(
                  (r) => r.name === filterName
                );
                if (recipe) {
                  handleRemoveSelectedRecipe(recipe.id);
                }
              }}
            />
            {debouncedSearchText.trim().length > 0 &&
              recipesAsMealData.length > 0 && (
                <View style={{ marginTop: 10 }}>
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
                </View>
              )}
          </>
        )}
      </View>

      <Button
        onPress={handleAdd}
        title={"Add"}
        disabled={
          (mode === "manual" && (!foodName || !calories)) ||
          (mode === "search" && selectedRecipes.length === 0)
        }
      />
    </GradientView>
  );
};

export default CalorieInput;
