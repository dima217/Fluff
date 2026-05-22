import { useCreateMediaMutation } from "@/api";
import { SupportMessageAttachment } from "@/api/types";
import {
  getFilenameFromUri,
  getFileSizeFromUri,
  getFileTypeFromUri,
  ReactNativeFile,
  uploadFile,
} from "@/api/utils/fileUpload";
import { useCallback, useState } from "react";

export function useSupportImageUpload() {
  const [createMedia] = useCreateMediaMutation();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = useCallback(
    async (uris: string[]): Promise<SupportMessageAttachment[]> => {
      if (!uris.length) return [];

      setIsUploading(true);
      try {
        const attachments: SupportMessageAttachment[] = [];

        for (const uri of uris) {
          const filename = getFilenameFromUri(uri);
          const size = await getFileSizeFromUri(uri);
          const format = getFileTypeFromUri(uri);

          const created = await createMedia({
            filename,
            size,
            metadata: { format },
          }).unwrap();

          await uploadFile({
            uploadUrl: created.uploadUrl,
            file: { uri } as ReactNativeFile,
          });

          attachments.push({
            url: created.url,
            type: "image",
            name: filename,
          });
        }

        return attachments;
      } finally {
        setIsUploading(false);
      }
    },
    [createMedia]
  );

  return { uploadImages, isUploading };
}
