export function getGmtOffsetLabel(): string {
  const offsetMinutes = -new Date().getTimezoneOffset();
  const hours = offsetMinutes / 60;

  if (hours === 0) {
    return "GMT";
  }

  const sign = hours > 0 ? "+" : "";
  return Number.isInteger(hours)
    ? `GMT${sign}${hours}`
    : `GMT${sign}${hours.toFixed(1)}`;
}
