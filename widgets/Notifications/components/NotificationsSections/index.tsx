import { NotificationResponse } from "@/api";
import { useGetNotificationQuery, useMarkNotificationsAsReadMutation } from "@/api/slices/authApi";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/ui/ThemedText";
import NotificationCard from "@/widgets/Notifications/components/NotificationCard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { groupNotifications } from "../../utils";

const NotificationsSections = () => {
  const { data, isLoading } = useGetNotificationQuery();
  const [markAsRead] = useMarkNotificationsAsReadMutation();
  const grouped = groupNotifications(data || []);
  
  const unreadIdsRef = useRef<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (data && data.length > 0) {
        const unreadIds = data
          .filter(notification => !notification.isRead)
          .map(notification => notification.id);
        
        unreadIdsRef.current = unreadIds;
      }
      return () => {
        if (unreadIdsRef.current.length > 0) {
          markAsRead(unreadIdsRef.current);
        }
      };
    }, [data, markAsRead])
  );

  const renderSection = (
    title: string,
    notifications: NotificationResponse[],
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

  if (isLoading) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      {renderSection("New", grouped.new)}
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
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 6,
  },
  cardWrapper: {
    marginBottom: 8,
    paddingVertical: 4,
  },
});
