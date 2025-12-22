import { Dimensions, StyleSheet } from "react-native";

const CARD_WIDTH = Dimensions.get("window").width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

export const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  textDetails: {
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  calories: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginRight: 5,
  },
  actionIconWrapper: {
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
    height: 70,
    gap: 10,
    marginRight: 15,
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
    justifyContent: "space-between",
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
