import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import MediaPlaceholder from "../MediaPlaceholderPreview";
import MediaPreview from "../MediaPreview";

const MediaUploader: React.FC = () => {
  const { media, pickMedia, clearMedia, labelByType } = useMediaPicker();

  return (
    <View>
      <TouchableOpacity
        style={[styles.uploadArea, media ? styles.uploadAreaWithMedia : null]}
        activeOpacity={media ? 1 : 0.85}
        onPress={!media ? pickMedia : undefined}
      >
        {media ? (
          <MediaPreview media={media} onRemove={clearMedia} />
        ) : (
          <MediaPlaceholder />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MediaUploader;

const styles = StyleSheet.create({
  label: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "600",
  },
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
