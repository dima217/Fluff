import { AppColors, ColorPalette } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createCaloriesProgressStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor:
        colors.background === ColorPalette.light.background
          ? colors.card
          : colors.background,
      borderRadius: 15,
      padding: 20,
      marginHorizontal: 15,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    headerText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    editButton: {
      backgroundColor: colors.primary,
      borderRadius: 50,
      padding: 8,
    },
    progressContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    progressLabel: {
      color: colors.text,
    },
    progressText: {
      color: colors.primary,
      fontSize: 12,
    },
    calorieCountContainerWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 20,
    },
    calorieCountContainer: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    calorieCountText: {
      color: colors.text,
      fontSize: 40,
      lineHeight: 40,
      includeFontPadding: false,
    },
    calorieGoalText: {
      color: colors.secondary,
      fontSize: 24,
      lineHeight: 24,
      includeFontPadding: false,
    },
    nutrientButton: {
      paddingVertical: 4,
    },
    nutrientButtonText: {
      fontSize: 12,
      fontWeight: "400",
      letterSpacing: 0.3,
    },
  });
