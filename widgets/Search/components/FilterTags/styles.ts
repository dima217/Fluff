import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createFilterTagsStyles = (colors: AppColors) =>
  StyleSheet.create({
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
      backgroundColor: colors.inactive,
      borderRadius: 18,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    filterPillText: {
      color: colors.text,
      marginRight: 5,
    },
    inputPill: {
      backgroundColor: colors.border,
    },
    inputText: {
      color: colors.text,
      opacity: 0.8,
    },
    removeIconWrapper: {
      marginLeft: 6,
    },
    remove: {
      color: colors.reject,
      fontSize: 16,
      marginLeft: 4,
    },
    placeholderText: {
      color: colors.secondary,
      marginLeft: 10,
    },
  });
