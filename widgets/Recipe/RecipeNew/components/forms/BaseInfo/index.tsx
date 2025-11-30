import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View } from "react-native";
import { StepProps } from "../../../constants";

const BaseInfo = ({ data, onChange, onBack }: StepProps) => {
  return (
    <View>
      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">Base</ThemedText>
        <ThemedText type="xs">
          Break the chocolate into pieces and melt it with the butter in a
          double boiler, stirring constantly with a spatula or wooden spoon.
          Remove the resulting thick chocolate sauce from the boiler and let it
          cool.
        </ThemedText>
      </View>
      <View style={styles.mediaContainer}>
        <MediaUploader />
      </View>
      <TextInput label={"name"} placeholder="Enter" />
      <TextInput label={"Ccal"} placeholder="Enter" />
      <LongTextInput label={"Ingredients"} placeholder="Enter" />
    </View>
  );
};

export default BaseInfo;

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginBottom: 30,
  },
  mediaContainer: {
    marginBottom: 30,
  },
});
