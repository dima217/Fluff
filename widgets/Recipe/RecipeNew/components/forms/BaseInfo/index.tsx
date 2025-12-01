import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, Text, View } from "react-native";
import { StepProps } from "../../../constants";

const BaseInfo = ({
  data,
  onChange,
  errors,
}: StepProps & { errors?: Record<string, string> }) => {
  const renderError = (field: string) => {
    if (!errors || !errors[field]) return null;
    return <Text style={styles.errorText}>{errors[field]}</Text>;
  };

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
        <MediaUploader
          value={data.mediaUrl ?? undefined}
          onChange={(val) => onChange({ mediaUrl: val })}
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          label="Name"
          placeholder="Enter"
          value={data.name}
          onChangeText={(val) => onChange({ name: val })}
        />
        {renderError("name")}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          label="Ccal"
          placeholder="Enter"
          value={data.ccal?.toString()}
          onChangeText={(val) =>
            onChange({ ccal: val === "" ? undefined : Number(val) })
          }
        />
        {renderError("ccal")}
      </View>

      <View style={styles.inputWrapper}>
        <LongTextInput
          label="Ingredients"
          placeholder="Enter"
          value={data.ingredients}
          onChangeText={(val) => onChange({ ingredients: val })}
        />
        {renderError("ingredients")}
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
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
