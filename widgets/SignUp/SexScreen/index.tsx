import Button from "@/shared/Buttons/Button";
import SexPicker from "@/shared/ui/SexPicker";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

type Gender = "male" | "female" | null;

interface StepProps {
  onNext: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

const Sex = ({ onNext }: StepProps) => {
  const [sex, setSex] = useState<Gender>(null);
  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle"> I am...</ThemedText>
      <SexPicker selectedSex={sex} onSelect={setSex} />
      <Button title="Continue" onPress={onNext} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    gap: "8%",
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
  },
  button: {
    position: "absolute",
    bottom: "15%",
  },
});

export default Sex;
