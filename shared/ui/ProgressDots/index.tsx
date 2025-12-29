import { Colors } from "@/constants/design-tokens";
import { StyleSheet, View } from "react-native";

const DOT_SIZE = 8;
const LONG_WIDTH = 28;
const SHORT_WIDTH = DOT_SIZE;
const MARGIN = 4;

const ProgressDots = ({ totalSteps = 5, activeIndex = 0 }) => {
  const indicators = Array.from({ length: totalSteps }, (_, index) => {
    const isCurrent = index === activeIndex;
    const isCompleted = index < activeIndex;

    let style;
    if (isCurrent) {
      style = styles.currentStep;
    } else if (isCompleted) {
      style = styles.completedStep;
    } else {
      style = styles.defaultStep;
    }

    return <View key={index} style={[styles.dot, style]} />;
  });

  return (
    <View style={styles.container}>
      <View style={styles.dotsWrapper}>{indicators}</View>
    </View>
  );
};

export default ProgressDots;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  dotsWrapper: {
    flexDirection: "row",
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: MARGIN,
  },
  currentStep: {
    width: LONG_WIDTH,
    backgroundColor: Colors.primary,
  },
  completedStep: {
    width: SHORT_WIDTH,
    backgroundColor: Colors.primary,
  },
  defaultStep: {
    width: SHORT_WIDTH,
    backgroundColor: Colors.inactive,
  },
});
