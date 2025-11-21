import Library from "@/components/Library";
import SearchInput from "@/components/Search/ui/SearchInput";
import Toogle from "@/components/Toogle";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import LibraryContent from "@/widgets/ LibraryContent";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Home = () => {
  const [toogle, setToogle] = useState<string>("Recipes");
  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container]}>
        <SearchInput
          isFiltering={false}
          searchText={""}
          selectedFilters={[]}
          onSearchChange={() => {}}
          onToggleFilter={() => {}}
          onFilterRemove={() => {}}
        />
        <View
          style={{ flex: 1, alignSelf: "stretch", gap: 20, marginBottom: 20 }}
        >
          <ThemedText type="s">Library</ThemedText>
          <Library />
          <ThemedText type="s">Favourities</ThemedText>
        </View>
        <Toogle
          options={["Recipes", "Products"]}
          selected={toogle}
          onSelect={setToogle}
          containerStyle={styles.toogleContainer}
        />
        <LibraryContent selected={toogle} />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  toogleContainer: {
    justifyContent: "flex-start",
    gap: 10,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  container: {
    paddingTop: 40,
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
