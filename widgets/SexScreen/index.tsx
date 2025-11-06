import { StyleSheet, View } from "react-native";
import SexPicker from "../../components/ui/SexPicker";

interface StepProps {
  onNext: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

export const Sex: React.FC<Pick<StepProps, "onNext" | "onPrev">> = ({
  onNext,
  onPrev,
}) => (
  <View style={stepStyles.stepContainer}>
    <SexPicker />
  </View>
);

const stepStyles = StyleSheet.create({
  stepContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});

export default Sex;
