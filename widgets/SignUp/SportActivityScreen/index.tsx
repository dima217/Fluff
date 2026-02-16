import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityOption, activityOptions } from "./data/activityOptions";
import ActivityPicker from "./ui/ActivityPicker/index";

export const SportActivityScreen = () => {
  const { t } = useTranslation();
  const [selectedActivity, setSelectedActivity] = useState<ActivityOption | null>(null);

  const handleActivityPress = (activity: (typeof activityOptions)[0]) => {
    setSelectedActivity(activity);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.whatsYourSportActivity")}
      </ThemedText>
      <View style={styles.activityList}>
        {activityOptions.map((item) => (
          <ActivityPicker
            key={item.label}
            isSelected={selectedActivity === item}
            onPress={() => handleActivityPress(item)}
            label={item.label}
            trainingCount={item.trainingCount}
            description={item.description}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
  },
  title: {
    marginBottom: "8%",
    textAlign: "center",
  },
  activityList: {
    gap: 10,
  },
});