import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import View from "@/shared/View";

const Achievements = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Header title={t("profile.achievements")} />
    </View>
  );
};

export default Achievements;
