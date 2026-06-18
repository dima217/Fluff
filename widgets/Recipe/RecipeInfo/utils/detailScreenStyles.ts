import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createDetailScreenStyles = (colors: AppColors) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: colors.background,
      flex: 1,
    },
    innerContainer: {
      width: "100%",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      gap: 40,
    },
    background: {
      width: "100%",
      height: 500,
    },
    backgroundContent: {
      padding: 20,
    },
    scrollContent: {
      alignItems: "center",
      paddingBottom: 30,
    },
    gradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 20,
    },
    errorText: {
      color: colors.text,
      fontSize: 16,
      textAlign: "center",
    },
  });
