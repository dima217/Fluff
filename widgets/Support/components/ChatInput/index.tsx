import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import TextInput from "@/shared/Inputs/TextInput";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const MAX_FILE_MB = 100;
const MAX_IMAGES = 5;

interface PendingImage {
  id: string;
  uri: string;
}

interface ChatInputProps {
  onSend: (
    text: string,
    imageUris?: string[]
  ) => boolean | void | Promise<boolean | void>;
  onTypingChange?: (isTyping: boolean) => void;
  isSending?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onTypingChange,
  isSending = false,
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const [text, setText] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = (val: string) => {
    setText(val);
    if (val.length > 0) {
      onTypingChange?.(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTypingChange?.(false);
      }, 2000);
    } else {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTypingChange?.(false);
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    const imageUris = pendingImages.map((item) => item.uri);
    if (!trimmed && imageUris.length === 0) return;

    const result = await onSend(
      trimmed,
      imageUris.length > 0 ? imageUris : undefined
    );
    if (result === false) return;

    setText("");
    setPendingImages([]);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onTypingChange?.(false);
  };

  const handlePickImages = async () => {
    if (pendingImages.length >= MAX_IMAGES) {
      Alert.alert(
        "Limit reached",
        `You can attach up to ${MAX_IMAGES} photos per message.`
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "No permission",
        "Please allow access to your media library."
      );
      return;
    }

    const remaining = MAX_IMAGES - pendingImages.length;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
        allowsMultipleSelection: remaining > 1,
        selectionLimit: remaining,
      });

      if (result.canceled) return;

      const validAssets = result.assets.filter((asset) => {
        const sizeMB = (asset.fileSize ?? 0) / (1024 * 1024);
        return sizeMB <= MAX_FILE_MB;
      });

      if (validAssets.length < result.assets.length) {
        Alert.alert(
          "File too large",
          `Maximum file size is ${MAX_FILE_MB}MB.`
        );
      }

      if (!validAssets.length) return;

      setPendingImages((prev) => [
        ...prev,
        ...validAssets.map((asset) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          uri: asset.uri,
        })),
      ]);
    } catch {
      Alert.alert("Error", "Failed to open media library.");
    }
  };

  const handleRemoveImage = (id: string) => {
    setPendingImages((prev) => prev.filter((item) => item.id !== id));
  };

  const canSend =
    !isSending && (text.trim().length > 0 || pendingImages.length > 0);

  return (
    <View style={styles.container}>
      {pendingImages.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.previewRow}
        >
          {pendingImages.map((item) => (
            <View key={item.id} style={styles.previewItem}>
              <Image
                source={{ uri: item.uri }}
                style={styles.previewImage}
                contentFit="cover"
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemoveImage(item.id)}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={22}
                  color={colors.purple}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : null}

      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder="Message..."
        multiline
        returnKeyType="default"
        editable={!isSending}
        style={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        left={
          <TouchableOpacity
            onPress={handlePickImages}
            disabled={isSending}
            activeOpacity={0.8}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity
            style={[
              styles.sendBtn,
              { backgroundColor: canSend ? colors.primary : colors.inactive },
            ]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.8}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <Ionicons
                name="send"
                size={18}
                color={canSend ? colors.onPrimary : colors.secondary}
              />
            )}
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default ChatInput;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingVertical: 10,
      paddingBottom: 20,
    },
    previewRow: {
      paddingHorizontal: 16,
      paddingBottom: 40,
      gap: 8,
    },
    previewItem: {
      width: 72,
      height: 72,
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: colors.card,
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    removeBtn: {
      position: "absolute",
      top: 4,
      right: 4,
    },
    inputWrapper: {
      flex: 1,
    },
    inputContainer: {
      alignItems: "center",
      gap: 8,
    },
    input: {
      fontSize: 15,
      paddingVertical: 8,
      maxHeight: 100,
      color: "white",
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
  });
