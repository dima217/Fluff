import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import { useTranslation } from "@/hooks/useTranslation";
import GradientButton from "@/shared/Buttons/GradientButton";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { getFormError } from "@/widgets/Recipe/RecipeNew/utils/getFormError";
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CookingProcess = ({ onBack }: { onBack: () => void }) => {
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  const { control, formState: { errors }, watch } = useFormContext();
  const { t } = useTranslation();

  const getErrorMessage = (field: string) => getFormError(errors, field);

  const { fields, append, replace } = useFieldArray({
    control,
    name: "steps",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ title: "Step 1", description: "" });
    }
  }, []);

  const watchFieldArray = watch("steps");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft color={colors.text} />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">{t("recipe.cookingProcess")}</ThemedText>
        <ThemedText type="xs">{t("recipe.cookingProcessHint")}</ThemedText>
      </View>

      <View style={styles.stepsContainer}>
        {controlledFields.map((field, index) => (
          <View key={field.id} style={styles.stepInputsContainer}>
            {/* Title */}
            <Controller
              control={control}
              name={`steps.${index}.title` as const}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  label={t("recipe.title")}
                  placeholder={t("common.enter")}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={getErrorMessage(`steps.${index}.title`)}
                  right={
                    <TouchableOpacity
                      onPress={() => {
                        if (fields.length > 1) {
                          const updated = fields
                            .filter((_, i) => i !== index)
                            .map((step, idx) => ({
                              ...step,
                              title: `Step ${idx + 1}`,
                            }));
                      
                          replace(updated);
                        }
                      }}
                    >
                      <Feather name="x" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                  }
                />
              )}
            />

            {/* Description */}
            <Controller
              control={control}
              name={`steps.${index}.description` as const}
              render={({ field: { value, onChange } }) => (
                <LongTextInput
                  label={t("recipe.description")}
                  placeholder={t("common.enter")}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={getErrorMessage(`steps.${index}.description`)}
                />
              )}
            />

            <Controller
              control={control}
              name={`steps.${index}.stepMediaUrl` as const}
              render={({ field: { value, onChange } }) => (
                <MediaUploader
                  name={`steps.${index}.stepMediaUrl`}
                  control={control}
                  key={field.id}
                  value={value}
                  onChange={onChange}
                  type="image"
                />
              )}
            />
          </View>
        ))}
      </View>

      {getErrorMessage("steps") ? (
        <ThemedText type="xs" style={styles.stepsError}>
          {getErrorMessage("steps")}
        </ThemedText>
      ) : null}

      <GradientButton
        title={t("recipe.addStep")}
        onPress={() => {
          append({ title: `Step ${controlledFields.length + 1}`, description: "" });
        }}
      />
    </View>
  );
};

const createstyles = (colors: AppColors) => StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginVertical: 30,
  },
  stepsContainer: {
    gap: 30,
    marginBottom: 20,
  },
  stepInputsContainer: {
    gap: 20,
  },
  stepsError: {
    color: colors.reject,
    marginBottom: 12,
  },
});

export default CookingProcess;
