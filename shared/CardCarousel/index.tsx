import { useUpdateProfileMutation } from "@/api";
import { useDrag } from "@/contexts/DragContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import MealCardItem from "@/shared/CardCarousel/Cards";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useMealLikes } from "./hooks/useMealLikes";
import { useMealsData } from "./hooks/useMealsData";
import MealsFlatList from "./MealsFlatList";

export interface MealData {
  id: string;
  title: string;
  calories: string;
  imageUrl: string;
  isLiked?: boolean;
  status?: "Completed";
  productId?: number; // Product ID for like handler
  recipeId?: number; // Recipe ID for like handler
  isFluff: boolean;
}

export type CardsScrollVariant = "featured" | "mealsToday";

interface CardsScrollProps extends ViewProps {
  variant: CardsScrollVariant;
  products?: MealData[]; // Products data from API
  onCardPress: (item: MealData) => void;
  onLikePress?: (item: MealData) => void; // Optional custom handler, if not provided uses built-in logic
  onScrollToEnd?: () => void; // Callback when user scrolls near the end
  renderCardRightAction?: (item: MealData) => ReactNode;
  isDraggable?: boolean;
}

const CardsCarousel = ({
  variant,
  products,
  onCardPress,
  onLikePress: customOnLikePress,
  onScrollToEnd,
  isDraggable = false,
  renderCardRightAction,
}: CardsScrollProps) => {
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      container: {
        alignSelf: "stretch",
        zIndex: 1,
      },
      sectionTitle: {
        color: c.text,
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
        marginBottom: 10,
      },
      carouselList: {
        gap: 15,
      },
      verticalList: {
        gap: 10,
        paddingBottom: 20,
      },
    })
  );
  const isCarouselVariant = variant === "featured";

  const { dropZoneLayout, setIsOverDropZone } = useDrag();

  const finalData = products ?? [];
  const [updateProfile] = useUpdateProfileMutation();

  const { likes, toggleLike } = useMealLikes(finalData);

  const dataWithLikes = useMealsData(finalData, variant, likes);

  const memoizedCards = useMemo(() => {
    return dataWithLikes.map((item) => (
      <MealCardItem
        key={item.id}
        item={item}
        variant="carousel"
        isDraggable={false}
        onPress={onCardPress}
        onLike={toggleLike}
        rightAction={renderCardRightAction}
      />
    ));
  }, [dataWithLikes, onCardPress, toggleLike, renderCardRightAction]);

  const memoizedDraggableCards = useMemo(() => {
    if (!setIsOverDropZone) return null;

    return dataWithLikes.map((item) => (
      <MealCardItem
        key={item.id}
        item={item}
        variant="carousel"
        isDraggable
        dropZoneLayout={dropZoneLayout}
        setIsOverDropZone={setIsOverDropZone}
        onDrop={(item) => {
          updateProfile({
            recipeToCheatMealId: Number(item.id),
          });
        }}
        onPress={onCardPress}
        onLike={toggleLike}
        rightAction={renderCardRightAction}
      />
    ));
  }, [
    dataWithLikes,
    dropZoneLayout,
    setIsOverDropZone,
    updateProfile,
    onCardPress,
    toggleLike,
    renderCardRightAction,
  ]);

  if (isCarouselVariant) {
    return (
      <View style={[styles.container, styles.verticalList]}>
        {isDraggable ? memoizedDraggableCards : memoizedCards}
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <MealsFlatList
        data={dataWithLikes}
        onCardPress={onCardPress}
        onLikePress={toggleLike}
      />
    </View>
  );
};

export default CardsCarousel;
