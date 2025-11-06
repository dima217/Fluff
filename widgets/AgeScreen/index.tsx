import { Button, StyleSheet, View } from "react-native";
import StepContainer from "../../components/StepContainer";
import { ThemedText } from "../../components/ui/ThemedText";

interface StepProps {
  onNext: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

export const Age: React.FC<Pick<StepProps, "onFinish" | "onPrev">> = ({
  onFinish,
  onPrev,
}) => (
  <StepContainer>
    <ThemedText>I am...</ThemedText>
    <View style={stepStyles.buttonGroup}>
      <Button title="Назад" color="#444" onPress={onPrev} />
      <Button title="Завершить" color="#ff6b9a" onPress={onFinish} />
    </View>
  </StepContainer>
);

const stepStyles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default Age;
