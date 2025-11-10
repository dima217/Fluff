import AccountDetails from "@/components/AccountDetails";
import CardsCarousel from "@/components/CardCarousel";
import MediaCarousel from "@/components/MediaCarousel";
import SearchInput from "@/components/Search/ui/SearchInput";
import Toogle from "@/components/Toogle";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const Home = () => {
  const [toogle, setToogle] = useState<string>("All");
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <AccountDetails />
        <SearchInput
          isFiltering={false}
          searchText={""}
          selectedFilters={[]}
          onSearchChange={() => {}}
          onToggleFilter={() => {}}
          onFilterRemove={() => {}}
        />
        <Toogle
          options={["All", "Videos", "Recipes", "Calories Base"]}
          selected={toogle}
          onSelect={setToogle}
        />
        <View style={styles.popularContainer}>
          <ThemedText type="s">Popular recipes</ThemedText>
          <MediaCarousel onCardPress={() => {}} />
        </View>
        <View style={styles.myRecipesContainer}>
          <ThemedText type="s">My recipes</ThemedText>
          <CardsCarousel variant={"mealsToday"} />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  popularContainer: {
    marginTop: "10%",
    alignSelf: "stretch",
  },
  myRecipesContainer: {
    gap: 10,
    marginTop: "10%",
    alignSelf: "stretch",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: "15%",
    width: "100%",
    alignItems: "center",
  },
});
