import { Colors } from "@/constants/design-tokens";
import { StyleSheet, View } from "react-native";
import Marker from "../Marker";

const markerData = [
  {
    text: "Cheat Meal",
    color: Colors.cheatMeal,
  },
  {
    text: "Not Tracked",
    color: Colors.notTracked,
  },
  {
    text: "Strong Excess",
    color: Colors.strongExcess,
  },
  {
    text: "Insufficient Intake",
    color: Colors.insufficientIntake,
  },
];

const MarkerContainer = () => {
  const firstRow = markerData.slice(0, 2);
  const secondRow = markerData.slice(2, 4);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {firstRow.map((item, index) => (
          <View key={item.text} style={styles.markerColumn}>
            <Marker text={item.text} color={item.color} />
            <Marker
              text={secondRow[index]?.text || ""}
              color={secondRow[index]?.color}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default MarkerContainer;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 24,
  },
  markerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "flex-start",
  },
});
