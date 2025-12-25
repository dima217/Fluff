import { useTranslation } from "@/hooks/useTranslation";
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
  } = useFormContext();
  const { t } = useTranslation();

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
        <ThemedText type="subtitle">{t("recipe.base")}</ThemedText>
        <ThemedText type="xs">
          Break the chocolate into pieces and melt it with the butter in a
          double boiler, stirring constantly with a spatula or wooden spoon.
          Remove the resulting thick chocolate sauce from the boiler and let it
          cool.
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
              label={t("recipe.name")}
              placeholder={t("common.enter")}
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
        />
      </View>

      {/* INGREDIENTS */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="ingredients"
          render={({ field: { value, onChange } }) => (
            <LongTextInput
              label={t("recipe.ingredients")}
              placeholder={t("common.enter")}
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
