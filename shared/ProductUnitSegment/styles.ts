import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createProductUnitSegmentStyles = (colors: AppColors) =>
  StyleSheet.create({
    segment: {
      flexDirection: "row",
      borderRadius: 12,
      padding: 3,
      gap: 2,
      backgroundColor: colors.inactive,
    },
    btn: {
      borderRadius: 9,
      paddingHorizontal: 14,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    btnText: {
      fontSize: 15,
      fontWeight: "700",
    },
  });
