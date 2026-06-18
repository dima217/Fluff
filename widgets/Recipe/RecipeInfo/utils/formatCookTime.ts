export const formatCookTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}м`;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}ч ${remainingMinutes}м` : `${hours}ч`;
  }
  return `${minutes}м`;
};
