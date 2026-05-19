import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createSearchScreenStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    closeButton: {
      alignSelf: "flex-end",
      marginBottom: 10,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tag: {
      color: colors.secondary,
      fontSize: 14,
    },
    popularTag: {
      backgroundColor: colors.inactive,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
    selectedTag: {
      backgroundColor: colors.text,
    },
    selectedTagText: {
      color: colors.background,
    },
    tagText: {
      color: colors.text,
    },
    separator: {
      height: 1,
      backgroundColor: "transparent",
      marginVertical: 10,
    },
  });
