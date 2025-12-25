import Header from "@/shared/Header";
import View from "@/shared/View";
import NotificationCard from "@/widgets/Notifications/components/NotificationCard";

const Notifications = () => {
  const now = new Date();

  return (
    <View>
      <Header title="Notifications" />
      <NotificationCard createdAt={new Date(now.getTime() - 5 * 60 * 1000)} />
    </View>
  );
};

export default Notifications;
