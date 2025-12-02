import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const BaseInfo = () => {
  const {
    control,
    formState: { errors },
    getValues,
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
      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">Base</ThemedText>
        <ThemedText type="xs">
          Break the chocolate into pieces and melt it...
        </ThemedText>
      </View>

      {/* MEDIA */}
      <View style={styles.mediaContainer}>
        <Controller
          control={control}
          name="mediaUrl"
          render={({ field: { value, onChange } }) => (
            <MediaUploader value={value} onChange={onChange} />
          )}
        />
      </View>

      {/* NAME */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="name"
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

      {/* CCAL */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="ccal"
          render={({ field: { value, onChange } }) => {
            const textValue = value !== undefined ? String(value) : "";

            return (
              <TextInput
                label="Ccal"
                placeholder="Enter"
                keyboardType="numeric"
                value={textValue}
                errorMessage={getErrorMessage("ccal")}
                onChangeText={(text) => {
                  const onlyDigits = text.replace(/[^0-9]/g, "");

                  if (onlyDigits === "") {
                    onChange(undefined);
                  } else {
                    onChange(Number(onlyDigits));
                  }
                }}
              />
            );
          }}
        />
      </View>

      {/* INGREDIENTS */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="ingredients"
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

export default BaseInfo;

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginBottom: 30,
  },
  mediaContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
