import Header from "@/shared/Header";
import View from "@/shared/View";
import NotificationsSections from "@/widgets/Notifications/components/NotificationsSections";

const Notifications = () => {
  return (
    <View>
      <Header title="Notifications" />
      <NotificationsSections />
    </View>
  );
};

export default Notifications;
