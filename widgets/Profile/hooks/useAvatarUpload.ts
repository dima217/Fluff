import {
  useCreateMediaMutation,
  useMarkMediaUploadedMutation,
  useUpdateProfileMutation,
} from "@/api";
import {
  getFilenameFromUri,
  getFileSizeFromUri,
  getFileTypeFromUri,
  ReactNativeFile,
  uploadFile,
} from "@/api/utils/fileUpload";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

function isLocalUri(uri: string): boolean {
  return uri.startsWith("file://") || !uri.startsWith("http");
}

export interface UploadAvatarResult {
  success: boolean;
  photoUrl?: string;
  error?: string;
}

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [createMedia] = useCreateMediaMutation();
  const [markMediaUploaded] = useMarkMediaUploadedMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const pickAvatar = useCallback(async (): Promise<string | null> => {
    setError(null);

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      setError("No permission to access media library");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"] as any,
      quality: 0.9,
      allowsMultipleSelection: false,
    });

    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0].uri;
  }, []);

  const uploadAvatar = useCallback(
    async (avatarUri: string): Promise<UploadAvatarResult> => {
      if (!avatarUri) {
        const msg = "Avatar URI is required";
        setError(msg);
        return { success: false, error: msg };
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        let photoUrl = avatarUri;

        if (isLocalUri(avatarUri)) {
          const filename = getFilenameFromUri(avatarUri);
          const size = await getFileSizeFromUri(avatarUri);
          const mediaType = getFileTypeFromUri(avatarUri);

          const created = await createMedia({
            filename,
            size,
            metadata: {
              format: mediaType,
            },
          }).unwrap();

          await uploadFile({
            uploadUrl: created.uploadUrl,
            file: { uri: avatarUri } as ReactNativeFile,
            onProgress: (p) => setUploadProgress(Math.max(1, Math.floor(p))),
          });
          await markMediaUploaded(created.mediaId).unwrap();

          photoUrl = created.url;
        }

        const updatedProfile = await updateProfile({ photo: photoUrl }).unwrap();
        setUploadProgress(100);

        return { success: true, photoUrl: updatedProfile.photo ?? photoUrl };
      } catch (e: any) {
        const msg =
          e?.data?.message || e?.message || "Failed to upload avatar";
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsUploading(false);
      }
    },
    [createMedia, markMediaUploaded, updateProfile]
  );

  const resetAvatarUploadState = useCallback(() => {
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    pickAvatar,
    uploadAvatar,
    isUploading,
    uploadProgress,
    error,
    resetAvatarUploadState,
  };
}

