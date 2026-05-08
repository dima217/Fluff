import { useUpdateProfileMutation } from "@/api";
import { useDrag } from "@/contexts/DragContext";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { DraggableMealCard } from "../ui/Animated/DraggableMealCard";
import MealCard from "./Cards/MealCard";
import { useMealLikes } from "./hooks/useMealLikes";
import { useMealsData } from "./hooks/useMealsData";
import MealsFlatList from "./MealsFlatList";
import { featuredRecipes, mealsToday } from "./mock";

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
  const isCarouselVariant = variant === "featured";

  const { dropZoneLayout, setIsOverDropZone } = useDrag();

  const mockData = isCarouselVariant ? featuredRecipes : mealsToday;
  const finalData = products && products.length > 0 ? products : mockData;
  const [updateProfile] = useUpdateProfileMutation();

  const { likes, toggleLike } = useMealLikes(finalData);

  const dataWithLikes = useMealsData(finalData, variant, likes);

  const memoizedCards = useMemo(() => {
    return dataWithLikes.map((item) => (
      <MealCard
        key={item.id}
        title={item.title}
        calories={item.calories}
        imageUrl={item.imageUrl}
        onPress={() => onCardPress(item)}
        onLikePress={() => toggleLike(item)}
        variant="carousel"
        status={item.status}
        isLiked={item.isLiked}
        isFluff={item.isFluff}
        rightAction={renderCardRightAction?.(item)}
      />
    ));
  }, [dataWithLikes, onCardPress, renderCardRightAction, toggleLike]);

  const memoizedDraggableCards = useMemo(() => {
    if (setIsOverDropZone)
      return dataWithLikes.map((item) => (
        <DraggableMealCard
          key={item.id}
          item={item}
          dropZoneLayout={dropZoneLayout}
          setIsOverDropZone={setIsOverDropZone}
          onDrop={(item) => {
            updateProfile({
              recipeToCheatMealId: Number(item.id),
            });
          }}
        >
          <MealCard
            key={item.id}
            title={item.title}
            calories={item.calories}
            imageUrl={item.imageUrl}
            onPress={() => onCardPress(item)}
            onLikePress={() => toggleLike(item)}
            variant="carousel"
            status={item.status}
            isLiked={item.isLiked}
            isFluff={item.isFluff}
            rightAction={renderCardRightAction?.(item)}
          />
        </DraggableMealCard>
      ));
  }, [
    dataWithLikes,
    dropZoneLayout,
    onCardPress,
    renderCardRightAction,
    setIsOverDropZone,
    toggleLike,
    updateProfile,
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

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    zIndex: 1,
    elevation: 1,
  },
  sectionTitle: {
    color: "white",
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
});

export default CardsCarousel;
