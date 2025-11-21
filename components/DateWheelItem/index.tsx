import { StyleSheet, Text, View } from "react-native";
import Circle from "../ui/Circle";

function getDayOfWeekLetter(date: Date): string {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return days[date.getDay()];
}

interface DateItemData {
  isMarked: boolean;
  isToday: boolean;
}

interface DateWheelItemContentProps {
  date?: Date;
  data?: DateItemData;
  size?: number;
}
export function DateWheelItem({ date, data, size }: DateWheelItemContentProps) {
  if (!date || !data) return null;

  const { isMarked, isToday } = data;
  const dayOfWeekLetter = getDayOfWeekLetter(date);

  const toggleStyle = [
    styles.toggleBase,
    isToday && styles.toggleActive,
    !isToday && styles.toggleInactive,
  ];

  return (
    <View style={[styles.container, { width: size }]}>
      <View style={styles.topMarker}>
        {isMarked ? (
          <Circle text={dayOfWeekLetter} />
        ) : (
          <Text style={styles.dayOfWeekText}>{dayOfWeekLetter}</Text>
        )}
      </View>

      <View style={styles.toggleContainer}>
        <View style={toggleStyle}>
          {isToday && <View style={styles.greenCircle} />}
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
    backgroundColor: "#E4E4E4",
    justifyContent: "center",
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
  greenCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#34C759",
  },
});
