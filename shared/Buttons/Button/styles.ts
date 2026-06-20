import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  containerFlexible: {
    width: "100%",
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  containerCompact: {
    width: "auto",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
  },
  buttonTextCompact: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 14,
  },
  buttonTextMultiline: {
    textAlign: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: 8,
  },
});
