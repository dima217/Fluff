import AccountDetails from "@/components/AccountDetails";
import SearchInput from "@/components/Search/ui/SearchInput";
import Toogle from "@/components/Toogle";
import { Colors } from "@/constants/Colors";
import HomeContent from "@/widgets/HomeContent";
import SearchOverlayContent from "@/widgets/SearchOverlayContent";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";

const Home = () => {
  const [toogle, setToogle] = useState<string>("All");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const navigation = useNavigation();
  const handleFocus = () => setIsSearchFocused(true);
  const handleBlur = () => {};

  useEffect(() => {
    if (!isSearchFocused) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setIsSearchFocused(false);
        return true;
      }
    );
    const unsub = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      setIsSearchFocused(false);
    });

    return () => {
      backHandler.remove();
      unsub();
    };
  }, [isSearchFocused]);

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container]}>
        <AccountDetails />
        <SearchInput
          isFiltering={false}
          searchText={""}
          selectedFilters={[]}
          onSearchChange={() => {}}
          onToggleFilter={() => {}}
          onFilterRemove={() => {}}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isSearchFocused ? (
          <SearchOverlayContent />
        ) : (
          <>
            <Toogle
              options={["All", "Videos", "Recipes", "Calories Base"]}
              selected={toogle}
              onSelect={setToogle}
            />

            <HomeContent selected={toogle} />
          </>
        )}
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
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
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
