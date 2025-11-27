import AccountDetails from "@/components/AccountDetails";
import SearchInput from "@/components/Search/ui/SearchInput";
import Toogle from "@/components/Toogle";
import { Colors } from "@/constants/Colors";
import HomeContent from "@/widgets/HomeContent";
import { useRouter } from "expo-router";

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [toogle, setToogle] = useState("All");
  const router = useRouter();

  const navigateToSearch = () => {
    router.push("/(search)/search");
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <AccountDetails />

        <Pressable style={styles.pressableContainer} onPress={navigateToSearch}>
          <SearchInput
            isFiltering={false}
            searchText=""
            selectedFilters={[]}
            onSearchChange={() => {}}
            onToggleFilter={() => {}}
            onFilterRemove={() => {}}
            onBlur={() => {}}
          />
        </Pressable>

        <Toogle
          options={["All", "Videos", "Recipes", "Calories Base"]}
          selected={toogle}
          onSelect={setToogle}
        />
        <HomeContent selected={toogle} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  pressableContainer: {
    width: "100%",
    alignItems: "center",
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
});
