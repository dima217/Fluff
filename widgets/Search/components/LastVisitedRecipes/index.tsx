import type { MealData } from "@/shared/CardCarousel";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import LastVisitedCard from "./LastVisitedCard";

interface LastVisitedRecipesProps {
  recipeIds: number[];
  onCardPress: (item: MealData) => void;
}

/**
 * Показывает последние просмотренные рецепты. Каждый рецепт запрашивается по id
 * (useGetRecipeByIdQuery), поэтому отображаются все id из хранилища, а не только
 * те, что попали в первую страницу getRecipes.
 */
const LastVisitedRecipes: React.FC<LastVisitedRecipesProps> = ({
  recipeIds,
  onCardPress,
}) => {
  const renderItem = ({ item: recipeId }: ListRenderItemInfo<number>) => (
    <LastVisitedCard recipeId={recipeId} onCardPress={onCardPress} />
  );

  if (!recipeIds.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipeIds}
        keyExtractor={(id) => String(id)}
        renderItem={renderItem}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  listContent: {
    gap: 15,
  },
});

export default LastVisitedRecipes;
