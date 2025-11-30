import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { StepProps } from "../../../constants";

const CookingProcess = ({ data, onChange, onNext, onBack }: StepProps) => {
  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">Cooking Process</ThemedText>
        <ThemedText type="xs">
          Break the chocolate into pieces and melt it with the butter in a
          double boiler, stirring constantly with a spatula or wooden spoon.
          Remove the resulting thick chocolate sauce from the boiler and let it
          cool.
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginVertical: 30,
  },
  mediaContainer: {
    marginBottom: 30,
  },
});

export default CookingProcess;
