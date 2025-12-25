// components/HomeContent.tsx
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation();

  switch (selected) {
    case t("home.videos"):
      return (
        <>
          <View style={styles.section}>
            <View style={styles.allContainer}>
              <ThemedText type="s">{t("homeSections.myRecipes")}</ThemedText>
              <ThemedText type="xs" style={{ color: Colors.primary }}>
                {t("homeSections.seeAll")}
              </ThemedText>
            </View>
            <MediaCarousel onCardPress={() => {}} />
          </View>
          <View style={styles.section}>
            <ThemedText type="s">{t("homeSections.myRecipes")}</ThemedText>
            <MediaCarousel
              variant="long"
              onCardPress={() => {
                router.push("/(recipe)/recipe");
              }}
            />
          </View>
        </>
      );

    case t("home.recipes"):
      return (
        <>
          <View style={styles.section}>
            <View style={styles.allContainer}>
              <ThemedText type="s">{t("homeSections.myRecipes")}</ThemedText>
              <ThemedText type="xs" style={{ color: Colors.primary }}>
                {t("homeSections.seeAll")}
              </ThemedText>
            </View>
            <CardsCarousel onCardPress={() => {}} variant="mealsToday" />
          </View>
          <View style={styles.section}>
            <ThemedText type="s">{t("homeSections.mealsToday")}</ThemedText>
            <CardsCarousel onCardPress={() => {}} variant="featured" />
          </View>
        </>
      );

    case t("home.caloriesBase"):
      return (
        <View style={styles.section}>
          <ThemedText type="s">{t("homeSections.mealsToday")}</ThemedText>
          <CardsCarousel onCardPress={() => {}} variant="featured" />
        </View>
      );

    case t("home.all"):
    default:
      return (
        <>
          <View style={styles.section}>
            <ThemedText type="s">{t("homeSections.popularRecipes")}</ThemedText>
            <MediaCarousel onCardPress={() => {}} />
          </View>

          <View style={styles.section}>
            <ThemedText type="s">{t("homeSections.myRecipes")}</ThemedText>
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
