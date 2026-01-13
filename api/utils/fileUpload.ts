/**
 * Utility functions for uploading files to S3/MinIO using presigned URLs
 * Supports both web (File/Blob) and React Native (URI)
 */

// React Native file type
export interface ReactNativeFile {
  uri: string;
  type?: string;
  name?: string;
  size?: number;
}

/**
 * Extract filename from URI
 */
export function getFilenameFromUri(uri: string): string {
  const parts = uri.split("/");
  const filename = parts[parts.length - 1];

  // If filename doesn't have extension, add default based on URI
  if (!filename.includes(".")) {
    // Try to determine type from URI or use default
    if (uri.includes("image") || uri.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return `image_${Date.now()}.jpg`;
    }
    if (uri.includes("video") || uri.match(/\.(mp4|mov|avi|mkv)$/i)) {
      return `video_${Date.now()}.mp4`;
    }
    return `file_${Date.now()}`;
  }

  return filename;
}

/**
 * Get file size from URI (approximate)
 * In React Native, we can't always get exact file size from URI
 * This is a fallback that returns a default size
 */
export async function getFileSizeFromUri(uri: string): Promise<number> {
  try {
    // Try to get file info using fetch
    const response = await fetch(uri, { method: "HEAD" });
    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      return parseInt(contentLength, 10);
    }
  } catch (error) {
    console.warn("[getFileSizeFromUri] Failed to get file size:", error);
  }

  // Default sizes (in bytes)
  // For images: ~2MB, for videos: ~10MB
  if (uri.match(/\.(jpg|jpeg|png|gif|webp)$/i) || uri.includes("image")) {
    return 2 * 1024 * 1024; // 2MB
  }
  if (uri.match(/\.(mp4|mov|avi|mkv)$/i) || uri.includes("video")) {
    return 10 * 1024 * 1024; // 10MB
  }

  return 5 * 1024 * 1024; // Default 5MB
}

/**
 * Determine file type from URI
 */
export function getFileTypeFromUri(uri: string): "image" | "video" {
  if (uri.match(/\.(mp4|mov|avi|mkv|webm)$/i) || uri.includes("video")) {
    return "video";
  }
  return "image";
}

export type UploadFile = File | Blob | ReactNativeFile;

export interface UploadFileOptions {
  uploadUrl: string;
  file: UploadFile;
  contentType?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Check if file is React Native file (has URI)
 */
function isReactNativeFile(file: UploadFile): file is ReactNativeFile {
  return (
    typeof file === "object" &&
    "uri" in file &&
    typeof (file as any).uri === "string"
  );
}

/**
 * Upload a file directly to S3/MinIO using a presigned URL
 * Works in both web and React Native environments
 */
export async function uploadFile({
  uploadUrl,
  file,
  contentType,
  onProgress,
}: UploadFileOptions): Promise<void> {
  // Use XMLHttpRequest for progress tracking (works in both web and RN)
  return new Promise((resolve, reject) => {
    // In React Native, XMLHttpRequest is available
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress && xhr.upload) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(
            `Upload failed with status ${xhr.status}: ${xhr.statusText}`
          )
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to network error"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was aborted"));
    });

    xhr.open("PUT", uploadUrl);

    // Set content type
    if (contentType) {
      xhr.setRequestHeader("Content-Type", contentType);
    } else if (isReactNativeFile(file) && file.type) {
      xhr.setRequestHeader("Content-Type", file.type);
    } else if (file instanceof File) {
      xhr.setRequestHeader(
        "Content-Type",
        file.type || "application/octet-stream"
      );
    } else {
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
    }

    // Set content length if available
    if (isReactNativeFile(file) && file.size) {
      xhr.setRequestHeader("Content-Length", file.size.toString());
    } else if (file instanceof Blob || file instanceof File) {
      xhr.setRequestHeader("Content-Length", file.size.toString());
    }

    // Send file
    if (isReactNativeFile(file)) {
      // React Native: For presigned URLs with PUT, we need to send the file body directly
      // Read the file as blob first, then send it
      fetch(file.uri)
        .then((response) => response.blob())
        .then((blob) => {
          xhr.send(blob);
        })
        .catch((error) => {
          reject(new Error(`Failed to read file: ${error.message}`));
        });
    } else {
      // Web: send File or Blob directly
      xhr.send(file);
    }
  });
}

/**
 * Upload multiple files in parallel
 */
export async function uploadFiles(
  files: { uploadUrl: string; file: UploadFile; contentType?: string }[],
  onProgress?: (overallProgress: number) => void
): Promise<void[]> {
  const totalFiles = files.length;
  const progressMap = new Map<number, number>();

  const uploadPromises = files.map((fileData, index) => {
    return uploadFile({
      ...fileData,
      onProgress: (progress) => {
        progressMap.set(index, progress);
        if (onProgress) {
          const overallProgress =
            Array.from(progressMap.values()).reduce((sum, p) => sum + p, 0) /
            totalFiles;
          onProgress(overallProgress);
        }
      },
    });
  });

  return Promise.all(uploadPromises);
}
