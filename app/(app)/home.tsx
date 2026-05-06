import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import AccountDetails from "@/shared/AccountDetails";
import Toogle from "@/shared/Toogle";
import HomeContent from "@/widgets/Home";
import SearchInput from "@/widgets/Search/components/SearchInput";
import { useRouter } from "expo-router";

import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [toogle, setToogle] = useState(t("home.all"));
  const router = useRouter();

  const navigateToSearch = () => {
    router.push("/(search)/search");
  };

  const toggleOptions = [
    t("home.all"),
    t("home.videos"),
    t("home.recipes"),
    t("home.caloriesBase"),
  ];

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <AccountDetails />

        <SearchInput
          isPlaceholder={true}
          onPress={navigateToSearch}
          onToggleFilter={() => {}}
        />

        <Toogle
          options={toggleOptions}
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
