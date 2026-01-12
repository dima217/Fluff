import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import MealCard from "./Cards";
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
}

type CardsScrollVariant = "featured" | "mealsToday";

interface CardsScrollProps extends ViewProps {
  variant: CardsScrollVariant;
  products?: MealData[]; // Products data from API
  onCardPress: (item: MealData) => void;
  onLikePress?: (item: MealData) => void; // Optional custom handler, if not provided uses built-in logic
  onScrollToEnd?: () => void; // Callback when user scrolls near the end
}

const renderListItem = (
  { item }: ListRenderItemInfo<MealData>,
  onCardPress: (item: MealData) => void,
  onLikePress?: (item: MealData) => void
) => (
  <MealCard
    key={item.id}
    title={item.title}
    calories={item.calories}
    imageUrl={item.imageUrl}
    onPress={() => onCardPress(item)}
    onLikePress={onLikePress ? () => onLikePress(item) : undefined}
    variant={"list"}
    status={item.status}
    isLiked={item.isLiked}
  />
);

const renderCarouselItem = (
  item: MealData,
  onCardPress: (item: MealData) => void,
  onLikePress?: (item: MealData) => void
) => (
  <MealCard
    key={item.id}
    title={item.title}
    calories={item.calories}
    imageUrl={item.imageUrl}
    onPress={() => onCardPress(item)}
    onLikePress={onLikePress ? () => onLikePress(item) : undefined}
    variant={"carousel"}
    status={item.status}
    isLiked={item.isLiked}
  />
);

const CardsCarousel = ({
  variant,
  products,
  onCardPress,
  onLikePress: customOnLikePress,
  onScrollToEnd,
}: CardsScrollProps) => {
  const isCarouselVariant = variant === "featured";

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const [localLikes, setLocalLikes] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const mockData = isCarouselVariant ? featuredRecipes : mealsToday;
  const finalData = products && products.length > 0 ? products : mockData;

  useEffect(() => {
    if (finalData && !isInitialized) {
      const initialLikes: Record<string, boolean> = {};
      finalData.forEach((item) => {
        const key = item.productId
          ? `product-${item.productId}`
          : item.recipeId
            ? `recipe-${item.recipeId}`
            : item.id;
        initialLikes[key] = item.isLiked ?? false;
      });
      setLocalLikes(initialLikes);
      setIsInitialized(true);
    }
  }, [finalData, isInitialized]);

  const handleLike = useCallback(
    async (item: MealData) => {
      const key = item.productId
        ? `product-${item.productId}`
        : item.recipeId
          ? `recipe-${item.recipeId}`
          : item.id;

      const currentLiked = localLikes[key] ?? item.isLiked ?? false;

      const newLikedState = !currentLiked;
      setLocalLikes((prev) => ({
        ...prev,
        [key]: newLikedState,
      }));

      try {
        if (item.productId) {
          if (currentLiked) {
            await removeFromFavorites({
              type: "product",
              id: item.productId,
            }).unwrap();
          } else {
            await addToFavorites({
              type: "product",
              id: item.productId,
            }).unwrap();
          }
        } else if (item.recipeId) {
          if (currentLiked) {
            await removeFromFavorites({
              type: "recipe",
              id: item.recipeId,
            }).unwrap();
          } else {
            await addToFavorites({
              type: "recipe",
              id: item.recipeId,
            }).unwrap();
          }
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        setLocalLikes((prev) => ({
          ...prev,
          [key]: currentLiked,
        }));
      }
    },
    [addToFavorites, removeFromFavorites, localLikes]
  );

  const dataWithLikes = useMemo(() => {
    return finalData.map((item) => {
      const key = item.productId
        ? `product-${item.productId}`
        : item.recipeId
          ? `recipe-${item.recipeId}`
          : item.id;
      const isLiked = localLikes[key] ?? item.isLiked ?? false;

      return {
        ...item,
        isLiked,
      };
    });
  }, [finalData, localLikes]);

  const onLikePress = customOnLikePress || handleLike;

  const getRenderItem = (props: ListRenderItemInfo<MealData>) => {
    return renderListItem(props, onCardPress, onLikePress);
  };

  if (isCarouselVariant) {
    return (
      <View style={[styles.container, styles.verticalList]}>
        {dataWithLikes.map((item) =>
          renderCarouselItem(item, onCardPress, onLikePress)
        )}
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <FlatList
        data={dataWithLikes}
        bounces={false}
        renderItem={getRenderItem}
        horizontal={true}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselList}
        onEndReached={onScrollToEnd}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
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
