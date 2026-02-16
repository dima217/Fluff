import { useMediaUrl } from "@/api/hooks/useMediaUrl";
import { Colors } from "@/constants/design-tokens";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { MediaFile } from "../../hooks/useMediaPicker";

interface Props {
  media: MediaFile;
  onRemove: () => void;
}

const MediaPreview: React.FC<Props> = ({ media, onRemove }) => {
  const isLocalMedia =
    !!media.uri &&
    !media.uri.startsWith("http://") &&
    !media.uri.startsWith("https://") &&
    !media.uri.startsWith("/");

  const { url: mediaUrl, headers: mediaHeaders } = useMediaUrl(media.uri, {
    // Для локальных файлов (file://, ph:// и т.п.) хук не нужен
    skip: !media.uri || isLocalMedia,
  });
  
  return (
    <View style={styles.wrapper}>
      <Image
        key={media.uri}
        source={{
          uri: (isLocalMedia ? media.uri : mediaUrl) || media.thumbnail || "",
          ...(mediaHeaders && { headers: mediaHeaders }),
        }}
        style={styles.preview}
      />

      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <MaterialCommunityIcons
          name="close-circle"
          size={32}
          color={Colors.purple}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MediaPreview;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
