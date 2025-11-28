import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import MediaPlaceholder from "../MediaPlaceholderPreview";
import MediaPreview from "../MediaPreview";

const screenWidth = Dimensions.get("window").width;

const MediaUploader: React.FC = () => {
  const { media, pickMedia, clearMedia, labelByType } = useMediaPicker();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelByType}</Text>

      <TouchableOpacity
        style={styles.uploadArea}
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
  container: {
    padding: 20,
    backgroundColor: "#1c1c1c",
    minHeight: Dimensions.get("window").height,
  },
  label: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "600",
  },
  uploadArea: {
    width: screenWidth - 40,
    height: 300,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#9333ea",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    overflow: "hidden",
  },
});
