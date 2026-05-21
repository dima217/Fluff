import { useFavoriteToggle } from "@/api/hooks/useFavoriteToggle";
import type { RecipeResponse, TrackingResponse } from "@/api/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import MealCardItem from "@/shared/CardCarousel/Cards";
import { createMealCardStyles } from "@/shared/CardCarousel/Cards/MealCard/styles";
import { ThemedText } from "@/shared/ui/ThemedText";
import { getRecipesAsMealData } from "@/widgets/Home/utils/data";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface TrackingItemProps {
  record: TrackingResponse & {
    recipe?: RecipeResponse;
  };
  onPress: (recipeId?: number) => void;
  isEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
}

const SelectCircle: React.FC<{ selected: boolean }> = ({ selected }) => {
  const colors = useColors();
  return (
    <View
      style={[
        circleStyles.circle,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primary : "transparent",
        },
      ]}
    >
      {selected && <View style={[circleStyles.dot, { backgroundColor: colors.background }]} />}
    </View>
  );
};

const circleStyles = StyleSheet.create({
  circle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

const TrackingItem: React.FC<TrackingItemProps> = ({
  record,
  onPress,
  isEditMode = false,
  isSelected = false,
  onToggleSelect,
}) => {
  const styles = useThemedStyles(createMealCardStyles);
  const { toggleFavorite } = useFavoriteToggle();

  const imageSource = require("@/assets/images/FoodAva.png");

  const handlePress = () => {
    if (isEditMode) {
      onToggleSelect?.(record.id);
    } else {
      onPress(record.recipe?.id);
    }
  };

  if (record.recipe) {
    const item = getRecipesAsMealData([record.recipe])[0];

    return (
      <MealCardItem
        item={item}
        onPress={isEditMode ? () => onToggleSelect?.(record.id) : () => onPress(record.recipe?.id)}
        onLike={() =>
          !isEditMode &&
          toggleFavorite({
            id: record.recipe!.id,
            isFavorite: record.recipe!.favorite,
            type: "recipe",
          })
        }
        isDraggable={false}
        rightAction={isEditMode ? () => <SelectCircle selected={isSelected} /> : undefined}
      />
    );
  }

  return (
    <TouchableOpacity
      style={[styles.cardContainer, styles.carouselContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
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

      {isEditMode && (
        <View style={{ marginLeft: "auto" }}>
          <SelectCircle selected={isSelected} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TrackingItem;
