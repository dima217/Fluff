import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import View from "@/shared/View";
import AchievementsList from "@/widgets/Profile/components/AchievementsList";
import { StyleSheet } from "react-native";

const Achievements = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <Header title={t("profile.achievements")} />
      <AchievementsList />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 20,
  },
});

export default Achievements;
