import { useTranslation } from "@/hooks/useTranslation";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { getFormError } from "@/widgets/Recipe/RecipeNew/utils/getFormError";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const BaseInfo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  const getErrorMessage = (field: string) => getFormError(errors, field);

  return (
    <View>
      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">{t("recipe.base")}</ThemedText>
        <ThemedText type="xs">{t("recipe.baseHint")}</ThemedText>
      </View>

      <View style={styles.inputsContainer}>
        {/* MEDIA */}
        <Controller
          control={control}
          name="mediaUrl"
          render={({ field: { value, onChange } }) => (
            <MediaUploader
              name="mediaUrl"
              control={control}
              value={value}
              onChange={onChange}
              type="image"
              errorMessage={getErrorMessage("mediaUrl")}
            />
          )}
        />

        {/* NAME */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label={t("recipe.name")}
              placeholder={t("common.enter")}
              value={value}
              errorMessage={getErrorMessage("name")}
              onChangeText={onChange}
            />
          )}
        />

        {/* CCAL — temporarily hidden, calculated from ingredients */}
        {/* <Controller
          control={control}
          name="ccal"
          render={({ field: { value, onChange } }) => {
            const textValue = value !== undefined ? String(value) : "";

            return (
              <TextInput
                label={t("recipe.ccal")}
                placeholder={t("common.enter")}
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
        /> */}

        {/* DESCRIPTION */}
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <LongTextInput
              label={t("recipe.description")}
              placeholder={t("common.enter")}
              value={value}
              onChangeText={onChange}
              errorMessage={getErrorMessage("description")}
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
  inputsContainer: {
    gap: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
