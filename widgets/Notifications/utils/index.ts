import { mockNotifications } from "./mockdata";

export function renderTime(createdAt: Date | string) {
  if (!createdAt) return null;

  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
  return createdDate.toLocaleDateString();
}

export const groupNotifications = (notifications: typeof mockNotifications) => {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const last7DaysStart = new Date(todayStart);
  last7DaysStart.setDate(last7DaysStart.getDate() - 7);

  const last30DaysStart = new Date(todayStart);
  last30DaysStart.setDate(last30DaysStart.getDate() - 30);

  return {
    today: notifications.filter(
      (n) => new Date(n.createdAt) >= todayStart && new Date(n.createdAt) <= now
    ),
    yesterday: notifications.filter(
      (n) =>
        new Date(n.createdAt) >= yesterdayStart &&
        new Date(n.createdAt) < todayStart
    ),
    last7Days: notifications.filter(
      (n) =>
        new Date(n.createdAt) >= last7DaysStart &&
        new Date(n.createdAt) < yesterdayStart
    ),
    last30Days: notifications.filter(
      (n) =>
        new Date(n.createdAt) >= last30DaysStart &&
        new Date(n.createdAt) < last7DaysStart
    ),
    older: notifications.filter((n) => new Date(n.createdAt) < last30DaysStart),
  };
};
