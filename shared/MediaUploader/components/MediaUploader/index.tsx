import { AppColors, ColorPalette } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import MediaPlaceholder from "../MediaPlaceholderPreview";
import MediaPreview from "../MediaPreview";

interface MediaUploaderProps {
  value?: string;
  type: "image" | "video";
  onChange?: (media: string | undefined) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  type,
  onChange,
}) => {
  const styles = useThemedStyles(createMediaUploaderStyles);
  const { pickMedia, clearMedia } = useMediaPicker();

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
    <View>
      <TouchableOpacity
        style={[styles.uploadArea, value ? styles.uploadAreaWithMedia : null]}
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
    </View>
  );
};

export default MediaUploader;

const createMediaUploaderStyles = (colors: AppColors) => {
  const isLight = colors.background === ColorPalette.light.background;

  return StyleSheet.create({
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
  });
};
