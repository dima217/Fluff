
import { NotificationResponse } from "@/api";
import { AppColors } from "@/constants/design-tokens";
import { PushNotificationType } from "@/constants/pushNotifications";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedPushContent } from "@/services/push/getLocalizedPushContent";
import Button from "@/shared/Buttons/Button";
import Avatar from "@/shared/ui/Avatar";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { getNotificationActionRoute, renderTime } from "../../utils";

interface NotificationCardProps {
  notification: NotificationResponse;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const styles = useThemedStyles(createstyles);
  const router = useRouter();
  const { language } = useTranslation();

  const content = useMemo(
    () =>
      getLocalizedPushContent(
        language,
        notification.type,
        notification.data,
        {
          title: notification.title,
          body: notification.body,
        }
      ),
    [language, notification]
  );

  const handleAction = useCallback(() => {
    const route = getNotificationActionRoute(notification);
    if (!route) return;

    if (typeof route === "string") {
      router.replace(route);
      return;
    }

    router.push(route);
  }, [notification, router]);

  const showAction =
    notification.type === PushNotificationType.TRACKING_REMINDER ||
    notification.type === PushNotificationType.SUPPORT_TICKET_REPLY ||
    notification.type === PushNotificationType.ACHIEVEMENT_UNLOCKED;

  return (
    <View style={styles.container}>
      <Avatar size="medium" source={require("@/assets/images/Fluffy.png")} />
      <View style={styles.content}>
        <ThemedText style={styles.title}>{content.title}</ThemedText>
        <ThemedText type="mini" style={styles.description}>
          {content.body}
        </ThemedText>
        {showAction && content.actionText && (
          <View style={styles.buttons}>
            <Button
              title={content.actionText}
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={handleAction}
            />
          </View>
        )}
      </View>
      {notification.createdAt && (
        <ThemedText style={styles.time}>
          {renderTime(notification.createdAt, language)}
        </ThemedText>
      )}
    </View>
  );
};

export default NotificationCard;

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    marginBottom: 4,
    color: "#888",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  button: {
    minWidth: "45%",
    maxWidth: "65%",
    height: 30,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 12,
  },
});
