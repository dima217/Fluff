export function cookAtFromForm(hours?: string, minutes?: string): number {
  const h = Math.max(0, parseInt(hours || "0", 10) || 0);
  const m = Math.max(0, parseInt(minutes || "0", 10) || 0);
  return h * 3600 + m * 60;
}

export function cookAtToForm(seconds: number): { cookHours: string; cookMinutes: string } {
  if (!seconds || seconds <= 0) {
    return { cookHours: "", cookMinutes: "" };
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return {
    cookHours: h > 0 ? String(h) : "",
    cookMinutes: m > 0 ? String(m) : "",
  };
}
