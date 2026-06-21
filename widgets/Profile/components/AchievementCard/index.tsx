import type { AchievementCode } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ACHIEVEMENT_ICON_MAP } from "@/widgets/Profile/constants/achievementIcons";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface AchievementCardProps {
  code: AchievementCode;
  unlockedAt: string | null;
}

const formatAchievementDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const AchievementCard = ({ code, unlockedAt }: AchievementCardProps) => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const isUnlocked = unlockedAt != null;
  const Icon = ACHIEVEMENT_ICON_MAP[code];

  const dateLabel = useMemo(() => {
    if (!isUnlocked || !unlockedAt) return "—";
    return formatAchievementDate(unlockedAt);
  }, [isUnlocked, unlockedAt]);

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          isUnlocked ? styles.iconContainerUnlocked : styles.iconContainerLocked,
        ]}
      >
        <Icon
          width={32}
          height={40}
          style={!isUnlocked ? styles.iconLocked : undefined}
        />
      </View>

      <View style={styles.content}>
        <ThemedText type="mini" style={styles.date}>
          {dateLabel}
        </ThemedText>
        <ThemedText style={styles.title}>
          {t(`achievements.items.${code}`)}
        </ThemedText>
      </View>
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
      gap: 16,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainerUnlocked: {
      backgroundColor: colors.primary,
    },
    iconContainerLocked: {
      backgroundColor: colors.inactive,
    },
    iconLocked: {
      opacity: 0.35,
    },
    content: {
      flex: 1,
      gap: 4,
    },
    date: {
      color: colors.secondary,
    },
    title: {
      color: colors.text,
      fontWeight: "600",
    },
  });

export default AchievementCard;
