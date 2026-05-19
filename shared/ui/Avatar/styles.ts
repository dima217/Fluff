import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createAvatarStyles = (colors: AppColors) =>
  StyleSheet.create({
    avatarBackground: {
      backgroundColor: colors.text,
    },
    avatarText: {
      color: colors.primary,
    },
  });
