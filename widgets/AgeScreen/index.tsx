import Button from "@/components/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { AnimatedWheelPicker } from "@/components/WheelPicker";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

interface StepProps {
  onNext?: () => void;
  onPrev?: () => void;
  onFinish: () => void;
}

const ages = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

export const Age = ({ onPrev, onFinish }: StepProps) => {
  const [selectedAge, setSelectedAge] = useState("18");
  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle">How old are you?</ThemedText>
      <AnimatedWheelPicker data={ages} onValueChange={() => {}} />
      <Button title="Continue" onPress={onFinish} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    width: "100%",
    gap: "8%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
  },
  button: {
    position: "absolute",
    bottom: "15%",
  },
});

export default Age;
