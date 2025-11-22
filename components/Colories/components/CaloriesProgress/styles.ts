import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 8,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "white",
  },
  progressText: {
    color: Colors.primary,
    fontSize: 12,
  },
  calorieCountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 20,
  },
  calorieCountText: {
    color: "white",
    fontSize: 40,
  },
  calorieGoalText: {
    color: "gray",
    fontSize: 24,
  },
});
