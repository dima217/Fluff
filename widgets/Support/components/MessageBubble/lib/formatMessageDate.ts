export const formatMessageDate = (iso: string) => {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${h12}:${minutes} ${period} ${day} ${month}, ${year}`;
};
