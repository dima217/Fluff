import { useFavoriteToggle } from "@/api/hooks/useFavoriteToggle";
import type { RecipeResponse, TrackingResponse } from "@/api/types";
import MealCardItem from "@/shared/CardCarousel/Cards";
import { styles } from "@/shared/CardCarousel/Cards/MealCard/styles";
import { ThemedText } from "@/shared/ui/ThemedText";
import { getRecipesAsMealData } from "@/widgets/Home/utils/data";
import { Image, TouchableOpacity, View } from "react-native";

interface TrackingItemProps {
  record: TrackingResponse & {
    recipe?: RecipeResponse;
  };
  onPress: (recipeId?: number) => void;
}

const TrackingItem: React.FC<TrackingItemProps> = ({ record, onPress }) => {
  const { toggleFavorite } = useFavoriteToggle();
  console.log(record?.calories);

  const imageSource = require("@/assets/images/FoodAva.png");

  if (record.recipe) {
    const item = getRecipesAsMealData([record.recipe])[0];

    return (
      <MealCardItem
        item={item}
        onPress={() => onPress(record.recipe?.id)}
        onLikePress={() =>
          toggleFavorite({
            id: record.recipe!.id,
            isFavorite: record.recipe!.favorite,
            type: "recipe",
          })
        }
      />
    );
  }

  return (
    <TouchableOpacity
      style={[styles.cardContainer, styles.carouselContainer]}
      onPress={() => onPress(undefined)}
    >
      <View style={styles.carouselImageWrapper}>
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.recipeStatusTextContainer}>
        <ThemedText type="xs" style={styles.title}>
          {record.name}
        </ThemedText>
        <ThemedText type="xs">{`${record.calories} ккал`}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default TrackingItem;
