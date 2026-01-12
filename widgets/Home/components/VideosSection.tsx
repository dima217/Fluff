import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import MediaCarousel from "@/shared/MediaCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

const VideosSection = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.section}>
        <View style={styles.allContainer}>
          <ThemedText type="s">
            {t("homeSections.previoslyWatched")}
          </ThemedText>
          <ThemedText type="xs" style={{ color: Colors.primary }}>
            {t("homeSections.seeAll")}
          </ThemedText>
        </View>
        <MediaCarousel onCardPress={() => {}} />
      </View>
      <View style={styles.section}>
        <ThemedText type="s">
          {t("homeSections.recommendedRecipes")}
        </ThemedText>
        <MediaCarousel
          variant="long"
          onCardPress={() => {
            router.push("/(recipe)/recipe");
          }}
        />
      </View>
    </>
  );
};

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

export default VideosSection;

