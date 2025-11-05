import { CircleSizes } from "@/constants/components/CIrcle";
import { Dimensions, StyleSheet } from "react-native";

const SWIPER_WIDTH = Dimensions.get("window").width * 0.8;
const PADDING = 10;

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
  },
  swiperBar: {
    width: SWIPER_WIDTH,
    height: CircleSizes.SMALL + PADDING * 2,
    backgroundColor: "rgba(48, 47, 47, 0.2)",
    borderRadius: (CircleSizes.SMALL + PADDING * 2) / 2,
    justifyContent: "center",
  },
  labelContainer: {
    position: "absolute",
    left: CircleSizes.SMALL + PADDING * 4,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  animatedCircleStyle: {
    marginLeft: 8,
  },
  labelText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: (CircleSizes.SMALL + PADDING * 2) / 2,
  },
  blinkingArrowsContainer: {
    position: "absolute",
    right: CircleSizes.SMALL + PADDING,
    top: 0,
    bottom: 0,
    width: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },
});
