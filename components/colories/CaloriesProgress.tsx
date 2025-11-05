import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "../ui/Animated/progressBar/ProgressLine";
import { styles } from "./styles/progress.styles";

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Daily calorie intake</Text>
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <AntDesign name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressText}>
          {Math.round(progress)}% Complete
        </Text>
      </View>
      <ProgressBar progress={progress} />

      <View style={styles.calorieCountContainer}>
        <Text style={styles.calorieCountText}>{currentCalories}</Text>
        <Text style={styles.calorieGoalText}> / {dailyGoal}</Text>
      </View>
    </View>
  );
};

export default CalorieProgress;
