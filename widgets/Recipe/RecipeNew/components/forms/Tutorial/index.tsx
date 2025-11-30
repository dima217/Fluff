import { ThemedText } from "@/shared/ui/ThemedText";
import { View } from "react-native";
import { StepProps } from "../../../constants";

const Tutorial = ({ data, onChange, onNext, onBack }: StepProps) => {
  return (
    <View>
      <ThemedText></ThemedText>
    </View>
  );
};

export default Tutorial;
