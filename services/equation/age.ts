export function getAge(birthDate?: string | Date | null): number {
    if (!birthDate) return 0;
  
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return 0;
  
    const now = new Date();
  
    let age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
  
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < date.getDate())
    ) {
      age--;
    }
  
    return age > 0 ? age : 0;
  }