import {
  AnimatedWheelPicker,
  WheelItemData,
  WheelItemValue,
} from "@/shared/AnimatedWheelPicker";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

interface StepProps {
  onNext?: () => void;
  onPrev?: () => void;
  onFinish: () => void;
}

const agesData: WheelItemData<string>[] = Array.from(
  { length: 100 },
  (_, i) => {
    const ageValue = (i + 1).toString();
    return {
      key: ageValue,
      value: ageValue,
      content: "",
      dataForContent: {},
    };
  }
);

export const Age = ({ onPrev, onFinish }: StepProps) => {
  const [selectedAge, setSelectedAge] = useState<string>("18");

  const handleAgeChange = (value: WheelItemValue<string>) => {
    setSelectedAge(String(value));
  };

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        How old are you?
      </ThemedText>
      <ThemedText style={styles.currentAgeText}>
        Selected: {selectedAge}
      </ThemedText>
      <AnimatedWheelPicker
        data={agesData}
        itemSize={56}
        visibleCount={3}
        orientation="vertical"
        initialIndex={17}
        onValueChange={handleAgeChange}
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
  currentAgeText: {
    fontSize: 16,
    color: "#aaa",
  },
  button: {
    position: "absolute",
    bottom: "15%",
  },
});

export default Age;
