// components/HomeContent.tsx
import CardsCarousel from "@/shared/CardCarousel";
import { StyleSheet, View } from "react-native";

interface HomeContentProps {
  selected: string;
}

const LibraryContent = ({ selected }: HomeContentProps) => {
  switch (selected) {
    case "Recipes":
      return (
        <View style={styles.section}>
          <CardsCarousel onCardPress={() => {}} variant="featured" />
        </View>
      );
  }
};

export default LibraryContent;

const styles = StyleSheet.create({
  section: {
    gap: 20,
    marginTop: "6%",
    alignSelf: "stretch",
  },
  allContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
