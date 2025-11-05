import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import MealCard from "../ui/Cards/MealCard";

interface Meal {
  id: string;
  title: string;
  calories: string;
  imageUrl: string;
  isLiked?: boolean;
  status?: "Completed";
}

const featuredRecipes: Meal[] = [
  {
    id: "1",
    title: "Grilled Salmon with Asparagus",
    calories: "450",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/23/18/31/baked-salmon-1854371_1280.jpg",
    isLiked: true,
  },
  {
    id: "2",
    title: "Chicken Caesar Salad",
    calories: "320",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/09/16/17/57/caesars-salad-1673894_1280.jpg",
    isLiked: false,
  },
  {
    id: "3",
    title: "Vegan Burger",
    calories: "550",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
    isLiked: true,
  },
];

const mealsToday: Meal[] = [
  {
    id: "4",
    title: "Breakfast Smoothie",
    calories: "250",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/05/17/09/15/smoothie-2320498_1280.jpg",
    status: "Completed",
  },
  {
    id: "5",
    title: "Grilled Chicken",
    calories: "350",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/06/15/18/46/chicken-1459427_1280.jpg",
    status: "Completed",
  },
];

const CardsScroll = () => {
  const renderCarouselItem = ({ item }: { item: Meal }) => (
    <MealCard
      title={item.title}
      calories={item.calories}
      imageUrl={item.imageUrl}
      onPress={() => console.log(`Выбрано блюдо: ${item.title}`)}
      isCarouselItem={true}
      isLiked={item.isLiked}
    />
  );

  const renderListItem = ({ item }: { item: Meal }) => (
    <MealCard
      title={item.title}
      calories={item.calories}
      imageUrl={item.imageUrl}
      onPress={() => console.log(`Выбрано блюдо: ${item.title}`)}
      status={item.status}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/*  Horizontal */}
      <Text style={styles.sectionTitle}>Featured Recipes</Text>
      <FlatList
        data={featuredRecipes}
        renderItem={renderCarouselItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselList}
      />

      {/* Vertical */}
      <Text style={styles.sectionTitle}>Meals Today</Text>
      <FlatList
        data={mealsToday}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verticalList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
  },
  carouselList: {
    paddingHorizontal: 15,
  },
  verticalList: {
    paddingHorizontal: 15,
  },
});

export default CardsScroll;
