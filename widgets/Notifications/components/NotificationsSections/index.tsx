import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/ui/ThemedText";
import NotificationCard from "@/widgets/Notifications/components/NotificationCard";
import { ScrollView, StyleSheet, View } from "react-native";
import { groupNotifications } from "../../utils";
import { mockNotifications } from "../../utils/mockdata";

const NotificationsSections = () => {
  const grouped = groupNotifications(mockNotifications);

  const renderSection = (
    title: string,
    notifications: typeof mockNotifications
  ) => {
    if (notifications.length === 0) return null;
    return (
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        {notifications.map((n) => (
          <View key={n.id} style={styles.cardWrapper}>
            <NotificationCard {...n} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderSection("Today", grouped.today)}
      {renderSection("Yesterday", grouped.yesterday)}
      {renderSection("Last 7 Days", grouped.last7Days)}
      {renderSection("Last 30 Days", grouped.last30Days)}
      {renderSection("Older", grouped.older)}
    </ScrollView>
  );
};

export default NotificationsSections;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 6,
  },
  cardWrapper: {
    marginBottom: 8,
    padding: 4,
  },
});
