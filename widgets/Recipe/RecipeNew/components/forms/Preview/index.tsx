import { ThemedText } from "@/shared/ui/ThemedText";
import { View } from "react-native";
import { StepProps } from "../../../constants";

const Preview = ({ data, onChange, onSubmit, onBack }: StepProps) => {
  return (
    <View>
      <ThemedText></ThemedText>
    </View>
  );
};

export default Preview;
