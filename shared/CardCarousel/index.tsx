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
  onCardPress: () => void;
  onLikePress?: (item: MealData) => void; // Handler for like button
}

const renderListItem = (
  { item }: ListRenderItemInfo<MealData>,
  onCardPress: () => void,
  onLikePress?: (item: MealData) => void
) => (
  <MealCard
    key={item.id}
    title={item.title}
    calories={item.calories}
    imageUrl={item.imageUrl}
    onPress={onCardPress}
    onLikePress={onLikePress ? () => onLikePress(item) : undefined}
    variant={"list"}
    status={item.status}
    isLiked={item.isLiked}
  />
);

const renderCarouselItem = (
  item: MealData,
  onCardPress: () => void,
  onLikePress?: (item: MealData) => void
) => (
  <MealCard
    key={item.id}
    title={item.title}
    calories={item.calories}
    imageUrl={item.imageUrl}
    onPress={onCardPress}
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
  onLikePress,
}: CardsScrollProps) => {
  const isCarouselVariant = variant === "featured";

  // Use products data if provided, otherwise use mock data
  const mockData = isCarouselVariant ? featuredRecipes : mealsToday;
  const finalData = products && products.length > 0 ? products : mockData;

  const getRenderItem = (props: ListRenderItemInfo<MealData>) => {
    return renderListItem(props, onCardPress, onLikePress);
  };

  if (isCarouselVariant) {
    return (
      <View style={[styles.container, styles.verticalList]}>
        {finalData.map((item) =>
          renderCarouselItem(item, onCardPress, onLikePress)
        )}
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <FlatList
        data={finalData}
        bounces={false}
        renderItem={getRenderItem}
        horizontal={true}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselList}
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
