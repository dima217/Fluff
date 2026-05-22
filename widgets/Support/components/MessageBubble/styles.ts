import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createMessageBubbleStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      marginBottom: 4,
      paddingHorizontal: 16,
    },
    rowOwn: {
      alignItems: "flex-end",
    },
    rowOther: {
      alignItems: "flex-start",
    },
    contentWrapper: {
      paddingHorizontal: 14,
    },
    bubble: {
      maxWidth: "78%",
      borderRadius: 18,
      paddingVertical: 10,
    },
    bubbleOwn: {
      borderBottomRightRadius: 4,
    },
    bubbleOther: {
      flex: 0,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      lineHeight: 22,
    },
    content: {
      fontSize: 15,
      lineHeight: 21,
    },
    contentWithTitle: {
      marginTop: 6,
    },
    time: {
      fontSize: 11,
      marginTop: 8,
    },
  });
