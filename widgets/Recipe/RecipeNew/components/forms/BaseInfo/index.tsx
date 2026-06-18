import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { createFormStepStyles } from "@/widgets/Recipe/RecipeNew/styles/formStepStyles";
import { getFormError } from "@/widgets/Recipe/RecipeNew/utils/getFormError";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

const BaseInfo = () => {
  const styles = useThemedStyles(createFormStepStyles);
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  const getErrorMessage = (field: string) => getFormError(errors, field);

  return (
    <View>
      <View style={styles.headerFirst}>
        <ThemedText type="subtitle">{t("recipe.base")}</ThemedText>
        <ThemedText type="xs">{t("recipe.baseHint")}</ThemedText>
      </View>

      <View style={styles.fieldsContainer}>
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
