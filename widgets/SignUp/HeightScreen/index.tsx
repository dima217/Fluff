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
  onNext: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

// Диапазон роста от 100 до 220 см
const heightsData: WheelItemData<string>[] = Array.from(
  { length: 121 },
  (_, i) => {
    const heightValue = (i + 100).toString();
    return {
      key: heightValue,
      value: heightValue,
      content: "",
      dataForContent: {},
    };
  }
);

export const Height = ({ onPrev, onNext }: StepProps) => {
  const [selectedHeight, setSelectedHeight] = useState<string>("170");

  const handleHeightChange = (value: WheelItemValue<string>) => {
    setSelectedHeight(String(value));
  };

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        What's your height?
      </ThemedText>
      <ThemedText style={styles.currentValueText}>
        Selected: {selectedHeight} cm
      </ThemedText>
      <AnimatedWheelPicker
        data={heightsData}
        itemSize={56}
        visibleCount={3}
        orientation="vertical"
        initialIndex={70} // 170 см
        onValueChange={handleHeightChange}
        containerStyle={styles.animatedWheelPicker}
        animationType="lens"
        selectStyle={styles.selectorContainer}
      />
      <Button title="Continue" onPress={onNext} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    width: "90%",

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

export default Height;
