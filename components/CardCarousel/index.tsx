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
}

type CardsScrollVariant = "featured" | "mealsToday";

interface CardsScrollProps extends ViewProps {
  variant: CardsScrollVariant;
  onCardPress: () => void;
}

const renderListItem = (
  { item }: ListRenderItemInfo<MealData>,
  onCardPress: () => void
) => (
  <MealCard
    title={item.title}
    calories={item.calories}
    imageUrl={item.imageUrl}
    onPress={onCardPress}
    variant={"list"}
    status={item.status}
  />
);

const renderCarouselItem = (item: MealData, onCardPress: () => void) => (
  <MealCard
    title={item.title}
    calories={item.calories}
    imageUrl={item.imageUrl}
    onPress={onCardPress}
    variant={"carousel"}
    status={item.status}
  />
);

const CardsCarousel = ({ variant, onCardPress }: CardsScrollProps) => {
  const isCarouselVariant = variant === "featured";
  const getRenderItem = (props: ListRenderItemInfo<MealData>) => {
    return renderListItem(props, onCardPress);
  };

  if (isCarouselVariant) {
    return (
      <View style={[styles.container, styles.verticalList]}>
        {featuredRecipes.map((item) => renderCarouselItem(item, onCardPress))}
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <FlatList
        data={mealsToday}
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
