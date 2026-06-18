import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { createFormStepStyles } from "@/widgets/Recipe/RecipeNew/styles/formStepStyles";
import { getFormError } from "@/widgets/Recipe/RecipeNew/utils/getFormError";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const createTutorialStyles = (colors: AppColors) =>
  StyleSheet.create({
    ...createFormStepStyles(colors),
    mediaContainer: { marginBottom: 30 },
  });

const Tutorial = ({ onBack }: { onBack: () => void }) => {
  const colors = useColors();
  const styles = useThemedStyles(createTutorialStyles);
  const { control, formState: { errors } } = useFormContext();
  const { t } = useTranslation();

  const getErrorMessage = (field: string) => getFormError(errors, field);

  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <ThemedText type="subtitle">{t("recipe.addTutorial")}</ThemedText>
        <ThemedText type="xs">{t("recipe.tutorialHint")}</ThemedText>
      </View>

      <View style={styles.mediaContainer}>
        <Controller
          control={control}
          name="videoUrl"
          render={({ field: { value, onChange } }) => (
            <MediaUploader
              name="videoUrl"
              control={control}
              value={value}
              onChange={onChange}
              type="video"
              errorMessage={getErrorMessage("videoUrl")}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Tutorial;
