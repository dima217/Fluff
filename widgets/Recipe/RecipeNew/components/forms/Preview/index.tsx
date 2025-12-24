import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { ThemedText } from "@/shared/ui/ThemedText";
import { TouchableOpacity, View } from "react-native";
import { StepProps } from "../../../constants";

const Preview = ({ data, onSubmit, onBack }: StepProps) => {
  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft />
      </TouchableOpacity>
      <ThemedText></ThemedText>
    </View>
  );
};

export default Preview;
