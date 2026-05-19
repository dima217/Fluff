import { useMediaUrl } from "@/api/hooks/useMediaUrl";
import { useColors } from "@/contexts/ThemeContext";
import Circle from "@/shared/ui/Circle";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { MediaFile } from "../../hooks/useMediaPicker";

interface Props {
  media: MediaFile;
  onRemove: () => void;
}

const MediaPreview: React.FC<Props> = ({ media, onRemove }) => {
  const colors = useColors();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isLocalMedia =
    !!media.uri &&
    !media.uri.startsWith("http://") &&
    !media.uri.startsWith("https://") &&
    !media.uri.startsWith("/");

  const isVideo =
    media.uri?.endsWith(".mp4") ||
    media.uri?.endsWith(".mov") ||
    media.uri?.includes("video");

  const { url: mediaUrl } = useMediaUrl(media.uri, {
    skip: !media.uri || isLocalMedia,
  });

  const videoUri = isLocalMedia ? media.uri : mediaUrl;

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!media.uri || !isVideo) return;

      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(media.uri, {
          time: 1000,
        });
        setThumbnail(uri);
      } catch (e) {
        console.warn("Thumbnail error:", e);
      }
    };

    generateThumbnail();
  }, [isVideo, media.uri]);

  return (
    <View style={styles.wrapper}>
      {isVideo ? (
        isPlaying ? (
          <Video
            source={{ uri: videoUri ?? "" }}
            style={styles.preview}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            useNativeControls
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.preview}
            onPress={() => setIsPlaying(true)}
          >
            <Image source={{ uri: thumbnail || "" }} style={styles.preview} />

            <View style={styles.playButtonContainer}>
              <Circle
                svg={<Ionicons name="play" size={24} color={colors.onPrimary} />}
                frostedGlass
                onPress={() => setIsPlaying(true)}
              />
            </View>
          </TouchableOpacity>
        )
      ) : (
        <Image
          source={{
            uri: isLocalMedia ? media.uri : mediaUrl || media.thumbnail || "",
          }}
          style={styles.preview}
        />
      )}

      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <MaterialCommunityIcons
          name="close-circle"
          size={32}
          color={colors.purple}
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
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
