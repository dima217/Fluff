// components/HomeContent.tsx
import CardsCarousel from "@/components/CardCarousel";
import MediaCarousel from "@/components/MediaCarousel";
import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet, View } from "react-native";

interface HomeContentProps {
  selected: string;
}

const HomeContent = ({ selected }: HomeContentProps) => {
  switch (selected) {
    case "Videos":
      return (
        <View style={styles.section}>
          <ThemedText type="s">Popular videos</ThemedText>
          <MediaCarousel onCardPress={() => {}} />
        </View>
      );

    case "Recipes":
      return (
        <View style={styles.section}>
          <ThemedText type="s">My recipes</ThemedText>
          <CardsCarousel variant="featured" />
        </View>
      );

    case "Calories Base":
      return (
        <View style={styles.section}>
          <ThemedText type="s">Meals today</ThemedText>
          <CardsCarousel variant="featured" />
        </View>
      );

    case "All":
    default:
      return (
        <>
          <View style={styles.section}>
            <ThemedText type="s">Popular recipes</ThemedText>
            <MediaCarousel onCardPress={() => {}} />
          </View>

          <View style={styles.section}>
            <ThemedText type="s">My recipes</ThemedText>
            <CardsCarousel variant="mealsToday" />
          </View>
        </>
      );
  }
};

export default HomeContent;

const styles = StyleSheet.create({
  section: {
    gap: 20,
    marginTop: "10%",
    alignSelf: "stretch",
  },
});
