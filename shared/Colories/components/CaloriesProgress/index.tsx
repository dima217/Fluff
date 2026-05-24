import Edit from "@/assets/images/Edit_fill.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { useColors } from "@/contexts/ThemeContext";
import Circle from "@/shared/ui/Circle";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import React from "react";
import { Text, View } from "react-native";
import ProgressBar from "../../../ui/Animated/ProgressBar";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { createCaloriesProgressStyles } from "./styles";

interface CalorieProgressProps {
  currentCalories: number;
  dailyGoal: number;
  onEditPress: () => void;
}

const CalorieProgress: React.FC<CalorieProgressProps> = ({
  currentCalories,
  dailyGoal,
  onEditPress,
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createCaloriesProgressStyles);
  const { t } = useTranslation();
  const progress = dailyGoal > 0 ? (currentCalories / dailyGoal) * 100 : 0;

  return (
    <GradientView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="xs" style={styles.progressLabel}>
          {t("health.dailyCalorieIntake")}
        </ThemedText>

        <Circle size={CircleSizes.MINI} svg={<Edit fill={colors.onPrimary} />} onPress={onEditPress} />
      </View>

      <View style={styles.progressContainer}>
        <ThemedText type="xs">{t("health.progress")}</ThemedText>

        <Text style={styles.progressText}>
          {Math.round(progress)}% {t("health.complete")}
        </Text>
      </View>

      <ProgressBar progress={progress} />

      <View style={styles.calorieCountContainer}>
        <Text style={styles.calorieCountText}>{currentCalories}</Text>

        <Text style={styles.calorieGoalText}>
          {" / "}
          {dailyGoal}
        </Text>
      </View>
    </GradientView>
  );
};
export default CalorieProgress;
