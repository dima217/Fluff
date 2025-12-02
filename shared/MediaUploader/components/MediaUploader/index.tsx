import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import MediaPlaceholder from "../MediaPlaceholderPreview";
import MediaPreview from "../MediaPreview";

interface MediaUploaderProps {
  value?: string;
  onChange?: (media: string | undefined) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ value, onChange }) => {
  const { media, pickMedia, clearMedia } = useMediaPicker();

  const handleRemove = () => {
    clearMedia();
    onChange?.(undefined);
  };

  const handlePick = async () => {
    const picked = await pickMedia();
    if (onChange && picked) {
      onChange(picked.uri);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.uploadArea,
          media || value ? styles.uploadAreaWithMedia : null,
        ]}
        activeOpacity={media || value ? 1 : 0.85}
        onPress={media || value ? undefined : handlePick}
      >
        {media || value ? (
          <MediaPreview
            media={media ? media : { uri: value!, type: "image" }}
            onRemove={handleRemove}
          />
        ) : (
          <MediaPlaceholder />
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
