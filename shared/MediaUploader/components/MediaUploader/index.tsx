import { Colors } from "@/constants/design-tokens";
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
  const { pickMedia, clearMedia } = useMediaPicker();

  const handleRemove = () => {
    onChange?.(undefined);
    console.log(value);
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

const styles = StyleSheet.create({
  uploadArea: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.purple,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  uploadAreaWithMedia: {
    borderWidth: 0,
  },
});
