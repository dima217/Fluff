import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 20,
    width: "85%",
  },
  inputContainer: {
    width: "100%",
    borderRadius: 29,
    height: 58,
    paddingHorizontal: 10,
    borderColor: Colors.border,
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: Colors.inactive,
  },
  label: {
    fontSize: 16,
    color: "#E5E5E5",
    paddingTop: 10,
  },
  disabledInputContainer: {
    backgroundColor: Colors.inactive,
    borderBottomColor: Colors.inactive,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
  mainTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  labelContainer: {
    paddingHorizontal: 8,
  },
  leftContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorInputContainer: {
    borderBottomColor: Colors.reject,
  },
  errorContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  error: {
    fontSize: 10,
    color: Colors.reject,
  },
});

export default styles;
