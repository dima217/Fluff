// components/HomeContent.tsx
import { Colors } from "@/constants/Colors";
import CardsCarousel from "@/shared/CardCarousel";
import MediaCarousel from "@/shared/MediaCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

interface HomeContentProps {
  selected: string;
}

const HomeContent = ({ selected }: HomeContentProps) => {
  const router = useRouter();
  switch (selected) {
    case "Videos":
      return (
        <>
          <View style={styles.section}>
            <View style={styles.allContainer}>
              <ThemedText type="s">My recipes</ThemedText>
              <ThemedText type="xs" style={{ color: Colors.primary }}>
                See All
              </ThemedText>
            </View>
            <MediaCarousel onCardPress={() => {}} />
          </View>
          <View style={styles.section}>
            <ThemedText type="s">My recipes</ThemedText>
            <MediaCarousel
              variant="long"
              onCardPress={() => {
                router.push("/(recipe)/recipe");
              }}
            />
          </View>
        </>
      );

    case "Recipes":
      return (
        <>
          <View style={styles.section}>
            <View style={styles.allContainer}>
              <ThemedText type="s">My recipes</ThemedText>
              <ThemedText type="xs" style={{ color: Colors.primary }}>
                See All
              </ThemedText>
            </View>
            <CardsCarousel onCardPress={() => {}} variant="mealsToday" />
          </View>
          <View style={styles.section}>
            <ThemedText type="s">Meals today</ThemedText>
            <CardsCarousel onCardPress={() => {}} variant="featured" />
          </View>
        </>
      );

    case "Calories Base":
      return (
        <View style={styles.section}>
          <ThemedText type="s">Meals today</ThemedText>
          <CardsCarousel onCardPress={() => {}} variant="featured" />
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
            <CardsCarousel
              onCardPress={() => {
                router.push("/(recipe)/recipe");
              }}
              variant="mealsToday"
            />
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
  allContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
