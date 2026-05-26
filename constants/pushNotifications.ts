export const ANDROID_NOTIFICATION_CHANNEL_ID = "default";

export const PushNotificationType = {
  GENERIC: "generic",
  TRACKING_REMINDER: "tracking_reminder",
  SUPPORT_TICKET_REPLY: "support_ticket_reply",
} as const;

export type PushNotificationTypeValue =
  (typeof PushNotificationType)[keyof typeof PushNotificationType];

/** @deprecated Use PushNotificationType */
export const PushNotificationDataType = PushNotificationType;

export type PushNotificationData = Record<string, string>;

export interface SupportTicketReplyNotificationData {
  type: typeof PushNotificationType.SUPPORT_TICKET_REPLY;
  ticketId: string;
  status: string;
  subject?: string;
  messagePreview?: string;
}

export interface TrackingReminderNotificationData {
  type: typeof PushNotificationType.TRACKING_REMINDER;
  targetCalories: string;
  consumedCalories: string;
  caloriesLeft: string;
  date: string;
}

export interface LocalizedPushContent {
  title: string;
  body: string;
  actionText?: string;
}
