import { AppColors } from "@/constants/design-tokens";
import { cardSurface } from "@/shared/styles/cardSurface";
import { Dimensions, StyleSheet } from "react-native";

const CARD_WIDTH = Dimensions.get("window").width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

export const createMealCardStyles = (colors: AppColors) =>
  StyleSheet.create({
    cardContainer: {
      ...cardSurface(colors),
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 20,
      overflow: "hidden",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    contentContainer: {
      padding: 4,
      paddingLeft: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    textDetails: {
      flex: 1,
      minWidth: 0,
      flexDirection: "column",
      gap: 4,
    },
    title: {
      color: colors.text,
      marginBottom: 2,
    },
    calories: {
      fontSize: 16,
      color: colors.secondary,
      marginBottom: 5,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    recipeStatusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    recipeStatusTextContainer: {
      gap: 2,
    },
    statusText: {
      fontSize: 14,
      color: colors.text,
      marginRight: 5,
    },
    actionIconWrapper: {
      flexShrink: 0,
      marginLeft: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    fullWidthImageWrapper: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "60%",
      overflow: "hidden",
      borderBottomLeftRadius: 40,
    },
    carouselContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      width: "100%",
      height: 80,
      gap: 10,
      marginRight: 15,
      overflow: "hidden",
    },
    carouselImageWrapper: {
      width: 70,
      height: "100%",
      borderRadius: 10,
      overflow: "hidden",
    },
    carouselContentContainer: {
      flexDirection: "row",
      flex: 1,
      minWidth: 0,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    carouselTitle: {
      fontSize: 18,
      fontWeight: "500",
    },
    carouselCalories: {
      fontSize: 14,
    },
  });
