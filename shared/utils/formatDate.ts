export function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
  
    return `${day}.${month}`;
}