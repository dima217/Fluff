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
    calorieCountContainer: {
      flexDirection: "row",
      alignItems: "baseline",
      marginTop: 20,
    },
    calorieCountText: {
      color: colors.text,
      fontSize: 40,
    },
    calorieGoalText: {
      color: colors.secondary,
      fontSize: 24,
    },
    nutrientButton: {
      marginTop: 16,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.18)",
    },
    nutrientButtonText: {
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: 0.3,
    },
  });
