import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Tutorial = ({ onBack }: { onBack: () => void }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getErrorMessage = (field: string): string | undefined => {
    const error = errors[field];

    if (error && error.message) {
      return String(error.message);
    }

    return undefined;
  };

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
        <Controller
          control={control}
          name="videoUrl"
          render={({ field: { value, onChange } }) => (
            <MediaUploader value={value} onChange={onChange} />
          )}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="tutorialName"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Name"
              placeholder="Enter"
              value={value}
              errorMessage={getErrorMessage("name")}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="tutorialDescription"
          render={({ field: { value, onChange } }) => (
            <LongTextInput
              label="Ingredients"
              placeholder="Enter"
              value={value}
              onChangeText={onChange}
              errorMessage={getErrorMessage("ingredients")}
            />
          )}
        />
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
  inputWrapper: {
    marginBottom: 10,
  },
});
