import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createGradientButtonStyles = (colors: AppColors) =>
  StyleSheet.create({
    touchableContainer: {
      width: "100%",
      height: 56,
      borderRadius: 30,
      overflow: "hidden",
    },
    gradientContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    outline: {
      borderWidth: 1,
      borderColor: colors.secondary,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: "Inter-SemiBold",
    },
  });
