import { useGetAchievementsQuery } from "@/api/slices/achievementsApi";
import type { AchievementCode, AchievementResponse } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import AchievementCard from "@/widgets/Profile/components/AchievementCard";
import { ACHIEVEMENT_ORDER } from "@/widgets/Profile/constants/achievementIcons";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const sortAchievements = (
  achievements: AchievementResponse[] | undefined | null
): AchievementResponse[] => {
  const list = Array.isArray(achievements) ? achievements : [];
  const byCode = new Map(list.map((item) => [item.code, item]));
  return ACHIEVEMENT_ORDER.map(
    (code) =>
      byCode.get(code) ?? {
        id: 0,
        code,
        icon: code.replace(/_/g, "-"),
        unlockedAt: null,
      }
  );
};

const AchievementsList = () => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetAchievementsQuery();

  const achievements = useMemo(() => sortAchievements(data), [data]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.error}>{t("achievements.loadError")}</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.code}
          code={achievement.code as AchievementCode}
          unlockedAt={achievement.unlockedAt}
        />
      ))}
    </ScrollView>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 24,
      gap: 12,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    error: {
      color: colors.secondary,
      textAlign: "center",
    },
  });

export default AchievementsList;
