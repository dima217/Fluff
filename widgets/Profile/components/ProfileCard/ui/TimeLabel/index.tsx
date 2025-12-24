import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface TimeLabelProps {
  localText?: string;
}

const TimeLabel = ({ localText = "Local time" }: TimeLabelProps) => {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons
        name="time-outline"
        size={12}
        color={Colors.border}
        style={styles.icon}
      />
      <ThemedText type="xs">{time + ", " + localText}</ThemedText>
    </View>
  );
};

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // 0 -> 12
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 6,
  },
});

export default TimeLabel;
