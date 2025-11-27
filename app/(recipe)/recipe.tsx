import { Colors } from "@/constants/Colors";
import Button from "@/shared/Buttons/Button";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import RecipeCard from "@/widgets/Recipe/components/RecipeCard";
import FilterTags from "@/widgets/Search/components/FilterTags";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ImageBackground, ScrollView, StyleSheet } from "react-native";

export default function RecipeScreen() {
  const router = useRouter();

  const ingredients = [
    "Dark Chocolate (100g)",
    "Butter (180g)",
    "Wheat flour (100g)",
    "Brown Sugar (200g)",
    "Eggs (4)",
    "Walnuts (100g)",
  ];

  return (
    <ScrollView
      bounces={false}
      alwaysBounceVertical={false}
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require("@/assets/images/Cake.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
          }}
        />
      </ImageBackground>
      <View>
        <RecipeCard
          title="Brownie"
          category="Dessert"
          restaurant="Fluff"
          rating={5.0}
          time="1h"
          calories={676}
          description="One of the world's most popular desserts, the brownie, was invented in 1893 in the kitchen of the legendary Palmer House Hotel in Chicago. They still bake the cake there according to the original recipe, topped with an apricot glaze. The homemade version, however, has such a stunning sugar crust that glazing it would be a crime."
          onLike={() => console.log("Liked!")}
          onMenu={() => console.log("Menu pressed")}
        />
        <ThemedText>Ingredients</ThemedText>
        <FilterTags filters={ingredients} />
        <Button title={"Cook it"} onPress={function (): void {}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  innerContainer: {},
  background: {
    width: "100%",
    height: 500,
  },
  pressableContainer: {
    width: "100%",
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
});
