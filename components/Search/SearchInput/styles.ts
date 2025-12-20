import { Colors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchBarContainer: {
    height: 58,
    flexDirection: "row",
    backgroundColor: Colors.inactive,
    borderRadius: 34,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingRight: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    paddingLeft: 10,
    flex: 1,
    color: "white",
    fontSize: 16,
  },
});
