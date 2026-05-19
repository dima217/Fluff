import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createSearchInputStyles = (colors: AppColors) =>
  StyleSheet.create({
    searchBarContainer: {
      height: 58,
      flexDirection: "row",
      backgroundColor: colors.inactive,
      borderRadius: 34,
      alignItems: "center",
      marginBottom: 20,
      marginTop: 20,
      paddingHorizontal: 15,
      paddingRight: 4,
    },
    placeholderContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    placeholderText: {
      flex: 1,
    },
    placeholderInput: {
      color: colors.secondary,
      fontSize: 16,
    },
    row: {
      flexDirection: "row",
      paddingLeft: 10,
      alignItems: "center",
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
      color: colors.text,
      fontSize: 16,
    },
  });
