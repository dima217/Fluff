import { useEffect, useMemo, useState } from "react";
import {
  getMediaUrlType,
  isMediaServerUrl,
  isProxyUrl,
  normalizeMediaUrl,
} from "../utils/mediaUrl";
import { tokenStorage } from "../utils/tokenStorage";

export function useMediaUrl(
  url: string | null | undefined,
  options?: {
    skip?: boolean;
    placeholder?: string;
  }
) {
  const urlType = useMemo(() => getMediaUrlType(url), [url]);
  const normalizedUrl = useMemo(() => normalizeMediaUrl(url), [url]);

  const finalUrl = useMemo(() => {
    if (!url || options?.skip) return options?.placeholder ?? null;
    return normalizedUrl ?? options?.placeholder ?? null;
  }, [url, normalizedUrl, options?.skip, options?.placeholder]);

  const [headers, setHeaders] = useState<Record<string, string> | undefined>(
    undefined
  );

  useEffect(() => {
    if (!finalUrl || !isMediaServerUrl(finalUrl)) {
      setHeaders(undefined);
      return;
    }
    let cancelled = false;
    tokenStorage.getAccessToken().then((token) => {
      if (cancelled || !token) {
        if (!cancelled) setHeaders(undefined);
        return;
      }
      setHeaders({ Authorization: `Bearer ${token}` });
    });
    return () => {
      cancelled = true;
    };
  }, [finalUrl]);

  return {
    url: finalUrl,
    headers,
    normalizedUrl: normalizedUrl ?? undefined,
    urlType,
    isProxy: isProxyUrl(url),
    isLoading: false,
    error: undefined,
    refetch: () => {},
    canUseDirectly: urlType === "direct",
  };
}
