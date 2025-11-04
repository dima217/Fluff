import { Dimensions, StyleSheet } from "react-native";

const SWIPER_WIDTH = Dimensions.get("window").width * 0.8;
const PADDING = 10;
const CIRCLE_SIZE = 45;

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
  },
  swiperBar: {
    width: SWIPER_WIDTH,
    height: CIRCLE_SIZE + PADDING * 2,
    backgroundColor: "rgba(48, 47, 47, 0.2)",
    borderRadius: (CIRCLE_SIZE + PADDING * 2) / 2,
    justifyContent: "center",
  },
  labelContainer: {
    position: "absolute",
    left: CIRCLE_SIZE + PADDING * 4,
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
    // Важно, чтобы градиент заполнял родительский элемент
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: (CIRCLE_SIZE + PADDING * 2) / 2, // Наследование скругления
  },
});
