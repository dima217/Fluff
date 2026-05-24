import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import View from "@/shared/View";
import NotificationsSections from "@/widgets/Notifications/components/NotificationsSections";

const Notifications = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Header title={t("common.notifications")} />
      <NotificationsSections />
    </View>
  );
};

export default Notifications;
