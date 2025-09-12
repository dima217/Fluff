import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: 'white',
    fontSize: 14,
  },
  progressText: {
    color: Colors.primary,
    fontSize: 14,
  },
  calorieCountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 20,
  },
  calorieCountText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  calorieGoalText: {
    color: 'gray',
    fontSize: 24,
  },
});