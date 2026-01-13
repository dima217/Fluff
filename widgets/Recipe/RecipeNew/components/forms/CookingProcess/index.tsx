import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import GradientButton from "@/shared/Buttons/GradientButton";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CookingProcess = ({ onBack }: { onBack: () => void }) => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "steps",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ title: "Step 1", description: "" });
    }
  }, []);

  const renumberSteps = (currentFields: typeof fields) => {
    const renumbered = currentFields.map((step, index) => ({
      ...step,
      title: `Step ${index + 1}`,
    }));
    replace(renumbered);
  };

  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">{t("recipe.cookingProcess")}</ThemedText>
        <ThemedText type="xs">
          Break the chocolate into pieces and melt it with the butter in a
          double boiler, stirring constantly with a spatula or wooden spoon.
          Remove the resulting thick chocolate sauce from the boiler and let it
          cool.
        </ThemedText>
      </View>

      <View style={{ gap: 30 }}>
        {fields.map((field, index) => (
          <View key={field.id} style={{ gap: 12 }}>
            {/* Title */}
            <Controller
              control={control}
              name={`steps.${index}.title`}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  label={t("recipe.title")}
                  placeholder={t("common.enter")}
                  value={value}
                  onChangeText={onChange}
                  right={
                    <TouchableOpacity
                      onPress={() => {
                        if (fields.length > 1) {
                          remove(index);
                          renumberSteps(fields.filter((_, i) => i !== index));
                        }
                      }}
                    >
                      <Feather name="x" size={20} color={Colors.secondary} />
                    </TouchableOpacity>
                  }
                />
              )}
            />

            {/* Description */}
            <Controller
              control={control}
              name={`steps.${index}.description`}
              render={({ field: { value, onChange } }) => (
                <LongTextInput
                  label={t("recipe.description")}
                  placeholder={t("common.enter")}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <View style={styles.mediaContainer}>
              <Controller
                control={control}
                name={`steps.${index}.stepMediaUrl`}
                render={({ field: { value, onChange } }) => (
                  <MediaUploader
                    key={`${fields[index].id}-${value || "empty"}`}
                    value={value}
                    onChange={onChange}
                    type="image"
                  />
                )}
              />
            </View>
          </View>
        ))}
      </View>

      <GradientButton
        title={t("recipe.addStep")}
        onPress={() => {
          append({ title: `Step ${fields.length + 1}`, description: "" });
        }}
      />
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
