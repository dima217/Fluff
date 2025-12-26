import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { ThemedText } from "@/shared/ui/ThemedText";
import { TouchableOpacity, View } from "react-native";

const Preview = ({ onBack }: { onBack: () => void }) => {
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
