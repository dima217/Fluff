/**
 * Примеры использования медиа URL в React Native компонентах
 */

import React from "react";
import { Image, View, Text, ActivityIndicator } from "react-native";
import { useMediaUrl } from "../hooks/useMediaUrl";
import type { RecipeResponse } from "../types";

// Пример 1: Использование хука для одного изображения
export function RecipeImage({ imageUrl }: { imageUrl: string | null }) {
  const { url, isLoading, error, urlType } = useMediaUrl(imageUrl, {
    placeholder: "https://via.placeholder.com/300", // Placeholder для ошибок
  });

  if (isLoading) {
    return (
      <View style={{ width: 300, height: 200, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !url) {
    return (
      <Image
        source={{ uri: "https://via.placeholder.com/300" }}
        style={{ width: 300, height: 200 }}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={{ width: 300, height: 200 }}
      resizeMode="cover"
    />
  );
}

// Пример 2: Использование в компоненте рецепта
export function RecipeCard({ recipe }: { recipe: RecipeResponse }) {
  const coverImage = useMediaUrl(recipe.image.cover);
  const previewImage = useMediaUrl(recipe.image.preview);

  return (
    <View>
      {coverImage.isLoading ? (
        <ActivityIndicator />
      ) : (
        <Image
          source={{ uri: coverImage.url || "https://via.placeholder.com/300" }}
          style={{ width: "100%", height: 200 }}
          resizeMode="cover"
        />
      )}
      <Text>{recipe.name}</Text>
    </View>
  );
}

// Пример 3: Использование с expo-image (рекомендуется для React Native)
import { Image as ExpoImage } from "expo-image";

export function RecipeImageExpo({ imageUrl }: { imageUrl: string | null }) {
  const { url, isLoading, error } = useMediaUrl(imageUrl, {
    placeholder: "https://via.placeholder.com/300",
  });

  return (
    <ExpoImage
      source={{ uri: url || "https://via.placeholder.com/300" }}
      style={{ width: 300, height: 200 }}
      contentFit="cover"
      placeholder={<ActivityIndicator />}
      transition={200}
    />
  );
}

// Пример 4: Обработка ресурсов шагов рецепта
export function RecipeStepResources({
  resources,
}: {
  resources: Array<{ source: string; type: string }>;
}) {
  return (
    <View>
      {resources.map((resource, index) => {
        const media = useMediaUrl(resource.source);
        return (
          <View key={index}>
            {media.isLoading ? (
              <ActivityIndicator />
            ) : resource.type === "image" ? (
              <Image
                source={{ uri: media.url || "https://via.placeholder.com/300" }}
                style={{ width: "100%", height: 200 }}
                resizeMode="cover"
              />
            ) : (
              <Text>Video: {resource.source}</Text>
              // Используйте Video компонент для видео
            )}
          </View>
        );
      })}
    </View>
  );
}

// Пример 5: Прямое использование утилит (без хука)
import {
  normalizeMediaUrl,
  getMediaUrlType,
  isProxyUrl,
  extractMediaId,
} from "../utils/mediaUrl";
import { useGetMediaByIdQuery } from "../slices/mediaApi";

export function RecipeImageManual({ imageUrl }: { imageUrl: string | null }) {
  const urlType = getMediaUrlType(imageUrl);
  const isProxy = isProxyUrl(imageUrl);
  const mediaId = imageUrl ? extractMediaId(imageUrl) : null;

  // Загружаем только если это прокси URL
  const { data: blob, isLoading } = useGetMediaByIdQuery(mediaId || "", {
    skip: !isProxy || !mediaId,
  });

  // Создаем object URL для blob
  const blobUrl = React.useMemo(() => {
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  }, [blob]);

  // Определяем финальный URL
  const finalUrl = React.useMemo(() => {
    if (!imageUrl) return "https://via.placeholder.com/300";

    if (urlType === "direct") {
      return imageUrl;
    }

    if (urlType === "proxy") {
      return blobUrl || "https://via.placeholder.com/300";
    }

    return "https://via.placeholder.com/300";
  }, [imageUrl, urlType, blobUrl]);

  if (isLoading && isProxy) {
    return <ActivityIndicator />;
  }

  return (
    <Image
      source={{ uri: finalUrl }}
      style={{ width: 300, height: 200 }}
      resizeMode="cover"
    />
  );
}

