import { CircleSizes } from "@/constants/components/CIrcle";
import { Colors } from "@/constants/design-tokens";
import { StyleSheet, Text, View } from "react-native";
import Circle from "../ui/Circle";

function getDayOfWeekLetter(date: Date): string {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return days[date.getDay()];
}

function getStatusColor(
  status:
    | "cheatMeal"
    | "notTracked"
    | "strongExcess"
    | "insufficientIntake"
    | null
): string {
  switch (status) {
    case "cheatMeal":
      return Colors.cheatMeal;
    case "notTracked":
      return Colors.notTracked;
    case "strongExcess":
      return Colors.strongExcess;
    case "insufficientIntake":
      return Colors.insufficientIntake;
    default:
      return Colors.green;
  }
}

interface DateItemData {
  isMarked?: boolean;
  isToday: boolean;
  isSelected?: boolean;
  dayStatus?:
    | "cheatMeal"
    | "notTracked"
    | "strongExcess"
    | "insufficientIntake"
    | null;
}

interface DateWheelItemContentProps {
  date?: Date;
  data?: DateItemData;
  size?: number;
  isSelected?: boolean;
}
export function DateWheelItem({ date, data, size }: DateWheelItemContentProps) {
  if (!date || !data) return null;

  const { isToday, isSelected, dayStatus } = data;
  const dayOfWeekLetter = getDayOfWeekLetter(date);
  const shouldShowCircle = isSelected || isToday;
  const circleColor = shouldShowCircle
    ? getStatusColor(dayStatus || null)
    : Colors.green;

  const toggleStyle = [
    styles.toggleBase,
    (isSelected || isToday) && styles.toggleActive,
    !isSelected && !isToday && styles.toggleInactive,
  ];

  return (
    <View style={[styles.container, { width: size }]}>
      <View style={styles.topMarker}>
        <Text style={styles.dayOfWeekText}>{dayOfWeekLetter}</Text>
      </View>

      <View style={styles.toggleContainer}>
        <View style={toggleStyle}>
          {shouldShowCircle && (
            <Circle size={CircleSizes.XS} color={circleColor} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  topMarker: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  dayOfWeekText: {
    fontSize: 16,
    color: "#FF0077",
    fontWeight: "500",
  },
  toggleContainer: {
    width: "80%",
    paddingVertical: 10,
    backgroundColor: "#242424",
    justifyContent: "flex-start",
    borderRadius: 30,
    height: 100,
    alignItems: "center",
  },
  toggleBase: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  toggleActive: {
    backgroundColor: "#FFFFFF",
  },
});
