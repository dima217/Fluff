import { AppColors, ColorPalette } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface MediaUploaderProps {
  type: "image" | "video";
}

const MediaPlaceholder = ({ type = "image" }: MediaUploaderProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createMediaPlaceholderStyles);
  const { t } = useTranslation();
  const isLight =
    colors.background === ColorPalette.light.background;

  return (
    <View style={styles.placeholder}>
      <MaterialCommunityIcons
        name="image-plus"
        size={54}
        color={isLight ? colors.purple : colors.notTracked}
        style={styles.icon}
      />

      <View style={styles.button}>
        <ThemedText type="mini" style={styles.buttonLabel}>
          {type === "image"
            ? t("mediaUploader.addPhoto")
            : t("mediaUploader.addVideo")}
        </ThemedText>
      </View>

      <ThemedText type="xs" style={styles.hint}>
        {type === "image"
          ? t("mediaUploader.imageFormatsHint")
          : t("mediaUploader.videoFormatsHint")}
      </ThemedText>
    </View>
  );
};

export default MediaPlaceholder;

const createMediaPlaceholderStyles = (colors: AppColors) =>
  StyleSheet.create({
    placeholder: {
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      marginBottom: 18,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 25,
      marginBottom: 10,
    },
    buttonLabel: {
      color: colors.onPrimary,
    },
    hint: {
      color: colors.secondary,
    },
  });
