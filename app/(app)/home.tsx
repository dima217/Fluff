import AccountDetails from "@/components/AccountDetails";
import SearchInput from "@/components/Search/ui/searchInput/SearchInput";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

const Home = () => {
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
