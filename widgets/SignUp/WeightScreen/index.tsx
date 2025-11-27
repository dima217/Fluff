import {
  AnimatedWheelPicker,
  WheelItemData,
  WheelItemValue,
} from "@/shared/AnimatedWheelPicker";
import Button from "@/shared/Buttons/Button";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

interface StepProps {
  onNext?: () => void;
  onPrev?: () => void;
  onFinish: () => void;
}

// Диапазон веса от 30 до 150 кг
const weightsData: WheelItemData<string>[] = Array.from(
  { length: 121 },
  (_, i) => {
    const weightValue = (i + 30).toString();
    return {
      key: weightValue,
      value: weightValue,
      content: "",
      dataForContent: {},
    };
  }
);

export const Weight = ({ onPrev, onFinish }: StepProps) => {
  const [selectedWeight, setSelectedWeight] = useState<string>("70");

  const handleWeightChange = (value: WheelItemValue<string>) => {
    setSelectedWeight(String(value));
  };

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        What's your weight?
      </ThemedText>
      <ThemedText style={styles.currentValueText}>
        Selected: {selectedWeight} kg
      </ThemedText>
      <AnimatedWheelPicker
        data={weightsData}
        itemSize={56}
        visibleCount={3}
        orientation="vertical"
        initialIndex={40} // 70 кг
        onValueChange={handleWeightChange}
        containerStyle={styles.animatedWheelPicker}
        animationType="lens"
        selectStyle={styles.selectorContainer}
      />
      <Button title="Continue" onPress={onFinish} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    width: "100%",
    gap: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingTop: 80,
  },
  animatedWheelPicker: {
    width: "60%",
  },
  selectorContainer: {
    height: 56,
  },
  title: {
    marginBottom: 20,
  },
  currentValueText: {
    fontSize: 16,
    color: "#aaa",
  },
  button: {
    position: "absolute",
    bottom: "15%",
  },
});

export default Weight;
