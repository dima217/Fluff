import AccountDetails from "@/components/AccountDetails";
import SearchInput from "@/components/Search/ui/SearchInput";
import Toogle from "@/components/Toogle";
import { Colors } from "@/constants/Colors";
import HomeContent from "@/widgets/HomeContent";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const Home = () => {
  const [toogle, setToogle] = useState<string>("All");
  return (
    <View style={styles.mainContainer}>
      <View style={[styles.container]}>
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
      </View>
      <View style={styles.container}>
        <HomeContent selected={toogle} />
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
    alignItems: "center",
  },
  container: {
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
