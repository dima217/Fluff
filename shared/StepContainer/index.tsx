import { StyleSheet, View } from "react-native";

const StepContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <View style={stepStyles.stepContainer}>{children}</View>
);

export default StepContainer;

const stepStyles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
});
