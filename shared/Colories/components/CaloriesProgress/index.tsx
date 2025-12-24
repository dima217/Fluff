import Edit from "@/assets/images/Edit_fill.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import Circle from "@/shared/ui/Circle";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ProgressBar from "../../../ui/Animated/ProgressBar";
import { styles } from "./styles";

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
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (dailyGoal > 0) {
      const percentage = (currentCalories / dailyGoal) * 100;
      setProgress(percentage);
    } else {
      setProgress(0);
    }
  }, [currentCalories, dailyGoal]);

  return (
    <GradientView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="xs" style={styles.progressLabel}>
          Daily calorie intake
        </ThemedText>
        <Circle size={CircleSizes.MINI} svg={<Edit />} onPress={() => {}} />
      </View>

      <View style={styles.progressContainer}>
        <ThemedText type="xs">Progress</ThemedText>
        <Text style={styles.progressText}>
          {Math.round(progress)}% Complete
        </Text>
      </View>
      <ProgressBar progress={progress} />

      <View style={styles.calorieCountContainer}>
        <Text style={styles.calorieCountText}>{currentCalories}</Text>
        <Text style={styles.calorieGoalText}> / {dailyGoal}</Text>
      </View>
    </GradientView>
  );
};

export default CalorieProgress;
