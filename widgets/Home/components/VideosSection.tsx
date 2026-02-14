import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import MediaCarousel from "@/shared/MediaCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { searchStorage } from "@/utils/searchStorage";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const VideosSection = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [lastVisitedIds, setLastVisitedIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      setLastVisitedIds(searchStorage.getLastVisited());
    }, [])
  );

  const handleCardPress = useCallback(
    (id: string) => {
      router.push({
        pathname: "/(recipe)/recipe",
        params: { recipeId: id },
      });
    },
    [router]
  );

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
        {lastVisitedIds.length > 0 ? (
          <MediaCarousel
            recipeIds={lastVisitedIds}
            variant="short"
            onCardPress={handleCardPress}
          />
        ) : (
          <ThemedText type="xs" style={styles.emptyText}>
            Нет недавно просмотренных
          </ThemedText>
        )}
      </View>
      <View style={styles.section}>
        <ThemedText type="s">
          {t("homeSections.recommendedRecipes")}
        </ThemedText>
        {lastVisitedIds.length > 0 ? (
          <MediaCarousel
            recipeIds={lastVisitedIds}
            variant="long"
            onCardPress={handleCardPress}
          />
        ) : (
          <ThemedText type="xs" style={styles.emptyText}>
            Нет рекомендаций
          </ThemedText>
        )}
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
  emptyText: {
    opacity: 0.7,
  },
});

export default VideosSection;
