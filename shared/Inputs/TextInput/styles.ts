import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createTextInputStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      flexDirection: "column",
      gap: 4,
      width: "100%",
    },
    textInput: {
      flex: 1,
      paddingVertical: 12,
      color: colors.text,
    },
    inputContainer: {
      width: "100%",
      borderRadius: 29,
      height: 58,
      paddingHorizontal: 20,
      borderColor: colors.border,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.inactive,
    },
    label: {
      fontSize: 12,
      color: colors.label,
      paddingLeft: 15,
    },
    disabledInputContainer: {
      backgroundColor: colors.inactive,
      borderBottomColor: colors.inactive,
    },
    errorText: {
      color: colors.reject,
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
      borderBottomColor: colors.reject,
    },
    errorContainer: {
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    error: {
      fontSize: 10,
      color: colors.reject,
    },
  });
