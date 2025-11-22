import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    alignItems: "center",
    padding: 20,
    flex: 1,
    marginTop: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  toggleButton: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputSection: {
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
