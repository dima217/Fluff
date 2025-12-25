import {
  AnimatedWheelPicker,
  WheelItemData,
  WheelItemValue,
} from "@/shared/AnimatedWheelPicker";
import Button from "@/shared/Buttons/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

interface StepProps {
  onNext?: () => void;
  onPrev?: () => void;
  onFinish: () => void;
}
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

const Weight = ({ onPrev, onFinish }: StepProps) => {
  const [selectedWeight, setSelectedWeight] = useState<string>("70");

  const handleWeightChange = (value: WheelItemValue<string>) => {
    setSelectedWeight(String(value));
  };

  const { t } = useTranslation();

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.whatsYourWeight")}
      </ThemedText>
      <ThemedText style={styles.currentValueText}>
        {t("signUp.selected")}: {selectedWeight} kg
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
      <Button title={t("signUp.continue")} onPress={onFinish} style={styles.button} />
    </View>
  );
};

export default Weight;

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
