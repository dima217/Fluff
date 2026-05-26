import {
  LocalizedPushContent,
  PushNotificationType,
} from "@/constants/pushNotifications";
import { NotificationData } from "@/api/types";
import { Language } from "@/contexts/LocalizationContext";
import { translate } from "@/utils/i18n";

const truncate = (text: string, maxLength: number): string => {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
};

const parseCaloriesLeft = (data: NotificationData): number | null => {
  const raw = data.caloriesLeft?.trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export function getLocalizedPushContent(
  language: Language,
  type: string,
  data: NotificationData | undefined,
  fallback?: { title?: string; body?: string }
): LocalizedPushContent {
  const payload = data ?? {};

  switch (type) {
    case PushNotificationType.TRACKING_REMINDER: {
      const caloriesLeft = parseCaloriesLeft(payload);
      if (caloriesLeft !== null && caloriesLeft > 0) {
        return {
          title: translate(
            language,
            "pushNotifications.trackingReminder.title"
          ),
          body: translate(
            language,
            "pushNotifications.trackingReminder.body",
            { caloriesLeft }
          ),
          actionText: translate(
            language,
            "pushNotifications.actions.addMeal"
          ),
        };
      }

      return {
        title: translate(
          language,
          "pushNotifications.trackingReminderImmediate.title"
        ),
        body: translate(
          language,
          "pushNotifications.trackingReminderImmediate.body"
        ),
        actionText: translate(language, "pushNotifications.actions.addMeal"),
      };
    }

    case PushNotificationType.SUPPORT_TICKET_REPLY: {
      const messagePreview = payload.messagePreview?.trim() ?? "";
      const subject = payload.subject?.trim() ?? "";

      return {
        title: translate(
          language,
          "pushNotifications.supportTicketReply.title"
        ),
        body: messagePreview
          ? truncate(messagePreview, 120)
          : translate(
              language,
              "pushNotifications.supportTicketReply.bodyWithSubject",
              { subject: truncate(subject, 80) }
            ),
        actionText: translate(
          language,
          "pushNotifications.actions.openTicket"
        ),
      };
    }

    default:
      return {
        title: fallback?.title ?? "",
        body: fallback?.body ?? "",
      };
  }
}
