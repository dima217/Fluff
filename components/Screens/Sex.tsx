import { Button, StyleSheet, Text, View } from "react-native";
import StepContainer from "../StepContainer";

interface StepProps {
  onNext: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

export const Sex: React.FC<Pick<StepProps, "onNext" | "onPrev">> = ({
  onNext,
  onPrev,
}) => (
  <StepContainer>
    <Text style={stepStyles.title}>Шаг 2: Практика</Text>
    <Text style={stepStyles.body}>Запишите свою речь.</Text>
    <View style={stepStyles.buttonGroup}>
      <Button title="Назад" color="#444" onPress={onPrev} />
      <Button title="Далее" color="#ff6b9a" onPress={onNext} />
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

export default Sex;
