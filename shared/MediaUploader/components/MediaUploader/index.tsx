import { AppColors, ColorPalette } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import MediaPlaceholder from "../MediaPlaceholderPreview";
import MediaPreview from "../MediaPreview";

interface MediaUploaderProps {
  value?: string;
  type: "image" | "video";
  onChange?: (media: string | undefined) => void;
  errorMessage?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  type,
  onChange,
  errorMessage,
}) => {
  const styles = useThemedStyles(createMediaUploaderStyles);
  const { pickMedia, clearMedia } = useMediaPicker();
  const hasError = Boolean(errorMessage);

  const handleRemove = () => {
    onChange?.(undefined);
    clearMedia();
  };

  const handlePick = async () => {
    const picked = await pickMedia(type);
    if (onChange && picked) {
      onChange(picked.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.uploadArea,
          value ? styles.uploadAreaWithMedia : null,
          hasError && styles.uploadAreaError,
        ]}
        activeOpacity={value ? 1 : 0.85}
        onPress={() => {
          if (!value) handlePick();
        }}
      >
        {value ? (
          <MediaPreview media={{ uri: value, type }} onRemove={handleRemove} />
        ) : (
          <MediaPlaceholder type={type} />
        )}
      </TouchableOpacity>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default MediaUploader;

const createMediaUploaderStyles = (colors: AppColors) => {
  const isLight = colors.background === ColorPalette.light.background;

  return StyleSheet.create({
    container: {
      width: "100%",
      gap: 4,
    },
    uploadArea: {
      width: "100%",
      height: 250,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: isLight ? colors.border : colors.purple,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.videoBackground,
      overflow: "hidden",
    },
    uploadAreaWithMedia: {
      borderWidth: 0,
      backgroundColor: isLight ? colors.card : colors.videoBackground,
    },
    uploadAreaError: {
      borderColor: colors.reject,
    },
    errorContainer: {
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    error: {
      fontSize: 10,
      color: colors.reject,
    },
  });
};
