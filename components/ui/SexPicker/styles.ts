import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const calculatedWidth = screenWidth * 0.45;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    gap: 10,
  },
  pickerContainer: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 15,
  },
  picker: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: calculatedWidth,
  },
  touchableContainer: {
    width: "90%",
    height: 56,
    borderRadius: 30,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
});
