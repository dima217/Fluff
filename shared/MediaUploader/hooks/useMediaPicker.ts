import { useTranslation } from "@/hooks/useTranslation";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useCallback, useState } from "react";

export type MediaType = "image" | "video";

export interface MediaFile {
  uri: string;
  type: MediaType;
  thumbnail?: string | null;
}

export interface PickerAlert {
  title: string;
  message: string;
}

const MAX_FILE_MB = 100;

export const useMediaPicker = () => {
  const { t } = useTranslation();
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [pickerAlert, setPickerAlert] = useState<PickerAlert | null>(null);

  const clearPickerAlert = useCallback(() => setPickerAlert(null), []);

  const showError = (title: string, message: string) => {
    setPickerAlert({ title, message });
  };

  const validateFile = (asset: ImagePicker.ImagePickerAsset) => {
    const sizeMB = (asset.fileSize ?? 0) / (1024 * 1024);
    if (sizeMB > MAX_FILE_MB) {
      showError(
        t("mediaUploader.fileTooLargeTitle"),
        t("mediaUploader.fileTooLargeMessage"),
      );
      return false;
    }
    return true;
  };

  const requestPermissions = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError(
          t("mediaUploader.noPermissionTitle"),
          t("mediaUploader.noPermissionMessage"),
        );
        return false;
      }
      return true;
    } catch {
      showError(t("auth.error"), t("mediaUploader.requestPermissionsError"));
      return false;
    }
  };

  const getVideoThumbnail = async (uri: string): Promise<string | null> => {
    try {
      const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
      });
      return thumbnail;
    } catch {
      return null;
    }
  };

  const pickMedia = async (allowedType?: MediaType) => {
    const granted = await requestPermissions();
    if (!granted) return;

    try {
      const mediaTypes =
        allowedType === "image"
          ? ["images"]
          : allowedType === "video"
            ? ["videos"]
            : ["images", "videos"];

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes as any,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      if (allowedType && asset.type !== allowedType) {
        showError(
          t("mediaUploader.invalidMediaTypeTitle"),
          allowedType === "image"
            ? t("mediaUploader.expectedImage")
            : t("mediaUploader.expectedVideo"),
        );
        return;
      }

      if (!validateFile(asset)) return;

      let thumbnail: string | null = null;
      if (asset.type === "video") {
        thumbnail = await getVideoThumbnail(asset.uri);
      }

      const picked = {
        uri: asset.uri,
        type: asset.type as MediaType,
        thumbnail,
      };

      setMedia(picked);
      return picked;
    } catch {
      showError(t("auth.error"), t("mediaUploader.openLibraryError"));
    }
  };

  const clearMedia = () => {
    setMedia(null);
  };

  const labelByType = media
    ? media.type === "image"
      ? t("mediaUploader.photoUploaded")
      : t("mediaUploader.videoUploaded")
    : t("mediaUploader.addMedia");

  return {
    media,
    pickMedia,
    clearMedia,
    labelByType,
    pickerAlert,
    clearPickerAlert,
  };
};
