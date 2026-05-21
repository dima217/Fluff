import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert } from "react-native";

export interface AvatarPickerResult {
  uri: string;
}

export const useAvatarPicker = () => {
  const pickMedia = useCallback(
    async (_type: "image"): Promise<AvatarPickerResult | null> => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission", "Please allow access to your media library.");
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
    []
  );

  return { pickMedia };
};
