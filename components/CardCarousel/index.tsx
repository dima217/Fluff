import { FlatList, StyleSheet, View, ViewProps } from "react-native";
import MealCard from "./Cards";

interface Meal {
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
}

const featuredRecipes: Meal[] = [
  {
    id: "1",
    title: "Grilled Salmon with Asparagus",
    calories: "450",
    imageUrl:
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isLiked: true,
  },
  {
    id: "2",
    title: "Chicken Caesar Salad",
    calories: "320",
    imageUrl:
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isLiked: false,
  },
  {
    id: "3",
    title: "Vegan Burger",
    calories: "550",
    imageUrl: "...",
    isLiked: true,
  },
];

const mealsToday: Meal[] = [
  {
    id: "4",
    title: "Breakfast Smoothie",
    calories: "250",
    imageUrl:
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "Completed",
  },
  {
    id: "5",
    title: "Grilled Chicken",
    calories: "350",
    imageUrl:
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",

    status: "Completed",
  },
  {
    id: "4",
    title: "Breakfast Smoothie",
    calories: "250",
    imageUrl:
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "Completed",
  },
];

const renderFeaturedList = () => {
  const renderItem = ({ item }: { item: Meal }) => (
    <MealCard
      title={item.title}
      calories={item.calories}
      imageUrl={item.imageUrl}
      onPress={() => console.log(`Выбрано блюдо (Карусель): ${item.title}`)}
      variant={"carousel"}
      isLiked={item.isLiked}
    />
  );

  return (
    <View>
      <FlatList
        data={featuredRecipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselList}
      />
    </View>
  );
};

const renderMealsTodayList = () => {
  const renderItem = ({ item }: { item: Meal }) => (
    <MealCard
      title={item.title}
      calories={item.calories}
      imageUrl={item.imageUrl}
      onPress={() => console.log(`Выбрано блюдо (Список): ${item.title}`)}
      variant={"list"}
      status={item.status}
    />
  );

  return (
    <View style={{}}>
      <FlatList
        data={mealsToday}
        bounces={false}
        renderItem={renderItem}
        horizontal={true}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselList}
      />
    </View>
  );
};

const CardsCarousel = ({ variant, ...rest }: CardsScrollProps) => {
  const content = (
    <View style={rest.style}>
      {variant === "featured" && renderFeaturedList()}
      {variant === "mealsToday" && renderMealsTodayList()}
    </View>
  );

  return <View style={styles.container}>{content}</View>;
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
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

export default CardsCarousel;
