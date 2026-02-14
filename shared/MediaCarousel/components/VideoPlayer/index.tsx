import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useRef } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

type VideoPlayerProps = {
  videoUrl: string | number;
  onClose: () => void;
};

export default function VideoPlayer({ videoUrl, onClose }: VideoPlayerProps) {
  const source = typeof videoUrl === "string" ? { uri: videoUrl } : videoUrl;

  const videoRef = useRef<Video>(null);
  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={source}
        style={{ width, height }}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
      />
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Ionicons name="close" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
