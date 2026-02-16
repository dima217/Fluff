import { Colors } from "@/constants/design-tokens";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { DeleteRecipeCardAction } from "@/shared/CardCarousel/cardActions";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import {
  cheatMealStorage,
  type CheatMealItem,
} from "@/utils/cheatMealStorage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

function cheatMealToMealData(item: CheatMealItem): MealData {
  return {
    id: String(item.id),
    title: item.name,
    calories: `${item.calories} ккал`,
    imageUrl: item.imageUrl,
    recipeId: item.id,
  };
}

export default function CheatMealScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CheatMealItem[]>(() =>
    cheatMealStorage.getAll()
  );

  const products: MealData[] = useMemo(
    () => items.map(cheatMealToMealData),
    [items]
  );

  const refresh = useCallback(() => {
    setItems(cheatMealStorage.getAll());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleCardPress = useCallback(
    (item: MealData) => {
      if (item.recipeId) {
        router.push({
          pathname: "/(recipe)/recipe",
          params: { recipeId: String(item.recipeId) },
        });
      }
    },
    [router]
  );

  const handleRemove = useCallback((item: MealData) => {
    if (item.recipeId != null) {
      cheatMealStorage.remove(item.recipeId);
      setItems(cheatMealStorage.getAll());
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Cheat Meal" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <ThemedText type="xs" style={styles.empty}>
            Пока ничего нет. Добавьте рецепт из экрана рецепта (меню ⋮).
          </ThemedText>
        ) : (
          <CardsCarousel
            products={products}
            variant="featured"
            onCardPress={handleCardPress}
            renderCardRightAction={(item) => (
              <DeleteRecipeCardAction item={item} onDelete={handleRemove} />
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  empty: {
    color: "#8B868F",
    textAlign: "center",
    marginTop: 24,
  },
});
