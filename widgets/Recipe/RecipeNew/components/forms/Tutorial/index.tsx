import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { StepProps } from "../../../constants";

const Tutorial = ({ data, onChange, onSubmit, onBack }: StepProps) => {
  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">Add a tutorial</ThemedText>
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
    </View>
  );
};

export default Tutorial;

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginVertical: 30,
  },
  mediaContainer: {
    marginBottom: 30,
  },
});
