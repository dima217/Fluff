import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inactive,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  filterPillText: {
    color: "white",
    marginRight: 5,
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
