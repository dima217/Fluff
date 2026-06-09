import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { useColors } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { getFormError } from "@/widgets/Recipe/RecipeNew/utils/getFormError";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Tutorial = ({ onBack }: { onBack: () => void }) => {
  const colors = useColors();
  const { control, formState: { errors } } = useFormContext();
  const { t } = useTranslation();

  const getErrorMessage = (field: string) => getFormError(errors, field);

  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft color={colors.text} />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
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

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginVertical: 30,
  },
  mediaContainer: {
    marginBottom: 30,
  },
});
