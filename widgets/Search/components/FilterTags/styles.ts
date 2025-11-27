import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inactive,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterPillText: {
    color: "white",
    marginRight: 5,
  },
  inputPill: {
    backgroundColor: Colors.border,
  },
  inputText: {
    color: "white",
    opacity: 0.8,
  },
  removeIconWrapper: {
    marginLeft: 6,
  },
  remove: {
    color: "red",
    fontSize: 16,
    marginLeft: 4,
  },
  placeholderText: {
    color: "gray",
    marginLeft: 10,
  },
});
