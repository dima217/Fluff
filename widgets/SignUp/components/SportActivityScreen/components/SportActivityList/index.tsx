import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View } from "react-native";
import { activityOptions } from "../../data/activityOptions";
import ActivityPicker from "../ui/ActivityPicker/index";

interface SportActivityListProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const SportActivityList = ({ value, onChange }: SportActivityListProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.whatsYourSportActivity")}
      </ThemedText>
      <View style={styles.activityList}>
        {activityOptions.map((item) => (
          <ActivityPicker
            key={item.id}
            isSelected={value === item.trainingCount}
            onPress={() => onChange(item.trainingCount)}
            label={t(`signUp.sportActivities.${item.id}.label`)}
            trainingCount={item.trainingCount}
            description={t(`signUp.sportActivities.${item.id}.description`)}
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