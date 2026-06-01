import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { useColors } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Tutorial = ({ onBack }: { onBack: () => void }) => {
  const colors = useColors();
  const { control } = useFormContext();
  const { t } = useTranslation();

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
            <MediaUploader value={value} onChange={onChange} type="video" />
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
