import { useEffect, useMemo, useState } from "react";
import { useGetMediaByIdQuery } from "../slices/mediaApi";
import {
  extractMediaId,
  getMediaUrlType,
  isProxyUrl,
  normalizeMediaUrl,
} from "../utils/mediaUrl";

/**
 * Hook for working with media URLs from API responses
 * Automatically determines the URL type and loads the proxy URL through the API
 *
 * @param url - URL from API response (can be proxy or direct)
 * @param options - Options for the request
 * @returns Object with media data
 */
export function useMediaUrl(
  url: string | null | undefined,
  options?: {
    skip?: boolean;
    placeholder?: string;
  }
) {
  const urlType = useMemo(() => getMediaUrlType(url), [url]);
  const normalizedUrl = useMemo(() => normalizeMediaUrl(url), [url]);
  const isProxy = useMemo(() => isProxyUrl(url), [url]);
  const mediaId = useMemo(() => (url ? extractMediaId(url) : null), [url]);

  const {
    data: blob,
    isLoading,
    error,
    refetch,
  } = useGetMediaByIdQuery(mediaId || "", {
    skip: !url || !isProxy || !mediaId || options?.skip,
  });

  const [directBlob, setDirectBlob] = useState<Blob | null>(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [directError, setDirectError] = useState<any>(null);

  useEffect(() => {
    if (urlType === "direct" && url && !options?.skip) {
      setDirectLoading(true);
      setDirectError(null);
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
          return response.blob();
        })
        .then((blob) => {
          setDirectBlob(blob);
          setDirectLoading(false);
        })
        .catch((err) => {
          setDirectError(err);
          setDirectLoading(false);
        });
    }
  }, [url, urlType, options?.skip]);

  const blobUrl = useMemo(() => {
    const currentBlob = isProxy ? blob : directBlob;
    if (currentBlob) {
      return URL.createObjectURL(currentBlob);
    }
    return null;
  }, [blob, directBlob, isProxy]);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const finalUrl = useMemo(() => {
    if (!url) return options?.placeholder || null;

    if (urlType === "direct") {
      if (directBlob && blobUrl) {
        return blobUrl;
      }
      if (directLoading) {
        return null;
      }
      return url;
    }
    if (urlType === "proxy") {
      if (blobUrl) {
        return blobUrl;
      }
      if (isLoading) {
        return null;
      }
      return options?.placeholder || null;
    }

    return options?.placeholder || null;
  }, [
    url,
    urlType,
    blobUrl,
    isLoading,
    directLoading,
    directBlob,
    options?.placeholder,
  ]);

  return {
    url: finalUrl,
    normalizedUrl,
    urlType,
    isProxy,
    blob: isProxy ? blob : directBlob,
    isLoading: isProxy ? isLoading : directLoading,
    error: isProxy ? error : directError,
    refetch: isProxy
      ? refetch
      : () => {
          if (urlType === "direct" && url) {
            setDirectBlob(null);
            setDirectError(null);
            fetch(url)
              .then((response) => response.blob())
              .then(setDirectBlob)
              .catch(setDirectError);
          }
        },
    canUseDirectly: urlType === "direct",
  };
}
