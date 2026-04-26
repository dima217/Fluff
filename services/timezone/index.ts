export function getDeviceTimeZone(): string {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return tz || 'UTC';
    } catch {
      return 'UTC';
    }
}