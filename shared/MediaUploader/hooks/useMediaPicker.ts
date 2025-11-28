import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useState } from "react";
import { Alert } from "react-native";

export type MediaType = "image" | "video";

export interface MediaFile {
  uri: string;
  type: MediaType;
  thumbnail?: string | null;
}

const MAX_FILE_MB = 100;

export const useMediaPicker = () => {
  const [media, setMedia] = useState<MediaFile | null>(null);

  const showError = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const validateFile = (asset: ImagePicker.ImagePickerAsset) => {
    const sizeMB = (asset.fileSize || 0) / (1024 * 1024);
    if (sizeMB > MAX_FILE_MB) {
      showError(
        "Слишком большой файл",
        `Максимальный размер — ${MAX_FILE_MB}MB.`
      );
      return false;
    }
    return true;
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showError("Нет разрешения", "Разрешите доступ к медиатеке.");
      return false;
    }
    return true;
  };

  const getVideoThumbnail = async (uri: string): Promise<string | null> => {
    try {
      const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
      });
      return thumbnail;
    } catch (e) {
      console.warn("Не удалось создать превью видео:", e);
      return null;
    }
  };

  const pickMedia = async () => {
    const granted = await requestPermissions();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!validateFile(asset)) return;

    let thumbnail: string | null = null;

    if (asset.type === "video") {
      thumbnail = await getVideoThumbnail(asset.uri);
    }

    setMedia({
      uri: asset.uri,
      type: asset.type as MediaType,
      thumbnail,
    });
  };

  const clearMedia = () => setMedia(null);

  const labelByType = media
    ? media.type === "image"
      ? "Загружено фото"
      : "Загружено видео"
    : "Добавить медиа";

  return {
    media,
    pickMedia,
    clearMedia,
    labelByType,
  };
};
