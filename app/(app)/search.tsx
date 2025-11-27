import SearchOverlayContent from "@/components/Search";
import SearchInput from "@/components/Search/ui/SearchInput";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

import { StyleSheet, View } from "react-native";

export default function SearchScreen() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SearchInput
        isFiltering={false}
        searchText=""
        selectedFilters={[]}
        onSearchChange={() => {}}
        onToggleFilter={() => {}}
        onFilterRemove={() => {}}
        onFocus={() => {}}
        onBlur={goBack}
      />

      <SearchOverlayContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: "5%",
  },
});
