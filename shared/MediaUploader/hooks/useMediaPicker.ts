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
    const sizeMB = (asset.fileSize ?? 0) / (1024 * 1024);
    console.log("[validateFile] sizeMB:", sizeMB);
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
    try {
      console.log("[requestPermissions] Запрос разрешений...");
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("[requestPermissions] Статус разрешений:", status);
      if (status !== "granted") {
        showError("Нет разрешения", "Разрешите доступ к медиатеке.");
        return false;
      }
      return true;
    } catch (e) {
      console.error("[requestPermissions] Ошибка запроса разрешений:", e);
      showError("Ошибка", "Не удалось запросить разрешения.");
      return false;
    }
  };

  const getVideoThumbnail = async (uri: string): Promise<string | null> => {
    try {
      console.log("[getVideoThumbnail] Создаём превью для видео:", uri);
      const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
      });
      console.log("[getVideoThumbnail] Превью создано:", thumbnail);
      return thumbnail;
    } catch (e) {
      console.warn("[getVideoThumbnail] Не удалось создать превью видео:", e);
      return null;
    }
  };

  const pickMedia = async () => {
    console.log("[pickMedia] Начало выбора медиа...");
    const granted = await requestPermissions();
    if (!granted) {
      console.log("[pickMedia] Разрешения не получены, выходим");
      return;
    }

    try {
      console.log("[pickMedia] Открываем медиатеку...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        quality: 1,
      });

      console.log("[pickMedia] Результат медиапикера:", result);

      if (result.canceled) {
        console.log("[pickMedia] Пользователь отменил выбор");
        return;
      }

      const asset = result.assets[0];
      console.log("[pickMedia] Выбранный asset:", asset);

      if (!validateFile(asset)) {
        console.log("[pickMedia] Файл не прошёл валидацию");
        return;
      }

      let thumbnail: string | null = null;
      if (asset.type === "video") {
        thumbnail = await getVideoThumbnail(asset.uri);
      }

      console.log("[pickMedia] Сохраняем медиа в state:", {
        uri: asset.uri,
        type: asset.type,
        thumbnail,
      });

      const picked = {
        uri: asset.uri,
        type: asset.type as MediaType,
        thumbnail,
      };

      setMedia(picked);
      return picked;
    } catch (e) {
      console.error("[pickMedia] Ошибка при выборе медиа:", e);
      showError("Ошибка", "Не удалось открыть медиатеку");
    }
  };

  const clearMedia = () => {
    console.log("[clearMedia] Очистка медиа");
    setMedia(null);
  };

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
