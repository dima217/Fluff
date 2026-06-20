import { useTranslation } from "@/hooks/useTranslation";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

export interface AvatarPickerResult {
  uri: string;
}

export interface PickerAlert {
  title: string;
  message: string;
}

export const useAvatarPicker = () => {
  const { t } = useTranslation();
  const [pickerAlert, setPickerAlert] = useState<PickerAlert | null>(null);

  const clearPickerAlert = useCallback(() => setPickerAlert(null), []);

  const pickMedia = useCallback(
    async (_type: "image"): Promise<AvatarPickerResult | null> => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setPickerAlert({
          title: t("mediaUploader.noPermissionTitle"),
          message: t("mediaUploader.noPermissionMessage"),
        });
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"] as any,
        quality: 0.9,
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets?.length) return null;
      return { uri: result.assets[0].uri };
    },
    [t],
  );

  return { pickMedia, pickerAlert, clearPickerAlert };
};
