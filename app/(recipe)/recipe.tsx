import { Colors } from "@/constants/design-tokens";
import { RecipeData } from "@/constants/types";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import Header from "@/shared/Header";
import View from "@/shared/View";
import IngredientsSection from "@/widgets/Recipe/RecipeInfo/components/IngredientsSection";
import RecipeCard from "@/widgets/Recipe/RecipeInfo/components/RecipeCard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import {
  ImageBackground,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function RecipeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const recipeData: RecipeData = {
    title: "Brownie",
    steps: [
      {
        id: 1,
        title: "Step 1",
        description:
          "Break the chocolate into pieces and melt it with the butter in a double boiler, stirring constantly with a spatula or wooden spoon. Remove the resulting thick chocolate sauce from the boiler and let it cool.",
      },
      {
        id: 2,
        title: "Step 2",
        description:
          "Meanwhile, mix the eggs with 100 grams of brown sugar. Crack the eggs into a separate bowl and beat, gradually adding the sugar. You can beat with a mixer or by hand — whichever you prefer — but for at least two and a half to three minutes.",
      },
      {
        id: 3,
        title: "Step 3",
        description:
          "Using a sharp knife, chop the walnuts on a cutting board. You can toast them in a dry frying pan beforehand until fragrant, but this is optional.",
        image: require("@/assets/images/step.png"),
      },
    ],
  };

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
        <RNView style={styles.backgroundContent}>
          <Header />
        </RNView>
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={styles.gradient}
        />
      </ImageBackground>

      <View style={styles.innerContainer}>
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

        <IngredientsSection />

        <Button
          title={t("recipe.cookIt")}
          onPress={() => {
            router.push({
              pathname: "/recipe-steps",
              params: { data: JSON.stringify(recipeData) },
            });
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  innerContainer: {
    width: "100%",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 40,
  },
  background: {
    width: "100%",
    height: 500,
  },
  backgroundContent: {
    padding: 20,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 30,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
});
