import { useColors } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ImageFullscreenViewerProps {
  visible: boolean;
  uri: string;
  headers?: Record<string, string>;
  onClose: () => void;
}

const ImageFullscreenViewer: React.FC<ImageFullscreenViewerProps> = ({
  visible,
  uri,
  headers,
  onClose,
}) => {
  const colors = useColors();
  const { width, height } = Dimensions.get("window");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Image
          source={headers ? { uri, headers } : { uri }}
          style={{ width, height }}
          contentFit="contain"
          transition={200}
        />
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={32} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ImageFullscreenViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
});
