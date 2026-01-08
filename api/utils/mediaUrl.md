# Работа с медиа URL

## Обзор

API может возвращать два типа URL для медиа файлов:

1. **Прямые URL** - внешние ссылки (`https://example.com/image.jpg`)
2. **Прокси URL** - ссылки через API (`/api/media/{mediaId}`)

## Утилиты

### `getMediaUrlType(url)`

Определяет тип URL.

```typescript
import { getMediaUrlType } from "@/api";

const urlType = getMediaUrlType(url);
// 'proxy' | 'direct' | 'invalid'
```

### `isProxyUrl(url)` / `isDirectUrl(url)`

Проверяют тип URL.

```typescript
import { isProxyUrl, isDirectUrl } from "@/api";

if (isProxyUrl(url)) {
  // Требует авторизации
}

if (isDirectUrl(url)) {
  // Можно использовать напрямую
}
```

### `extractMediaId(proxyUrl)`

Извлекает mediaId из прокси URL.

```typescript
import { extractMediaId } from "@/api";

const mediaId = extractMediaId("/api/media/507f1f77bcf86cd799439011");
// '507f1f77bcf86cd799439011'
```

### `normalizeMediaUrl(url)`

Нормализует URL для использования:

- Прокси URL → полный URL с базовым адресом
- Прямые URL → возвращает как есть

```typescript
import { normalizeMediaUrl } from "@/api";

const normalized = normalizeMediaUrl("/api/media/123");
// 'http://localhost:3000/api/media/123'
```

## Хуки

### `useMediaUrl(url, options?)`

Автоматически обрабатывает оба типа URL.

```typescript
import { useMediaUrl } from '@/api';

function RecipeImage({ imageUrl }: { imageUrl: string }) {
  const { url, isLoading, error, urlType } = useMediaUrl(imageUrl, {
    placeholder: 'https://via.placeholder.com/300',
  });

  if (isLoading) return <ActivityIndicator />;
  if (error || !url) return <PlaceholderImage />;

  return <Image source={{ uri: url }} />;
}
```

**Возвращает:**

- `url` - финальный URL для использования
- `normalizedUrl` - нормализованный URL
- `urlType` - тип URL ('proxy' | 'direct' | 'invalid')
- `isProxy` - является ли URL прокси
- `blob` - blob данные (только для прокси)
- `isLoading` - состояние загрузки
- `error` - ошибка загрузки
- `refetch` - функция повторной загрузки
- `canUseDirectly` - можно ли использовать напрямую

## Примеры использования

### Базовый пример

```typescript
import { useMediaUrl } from '@/api';
import { Image } from 'react-native';

function MyImage({ imageUrl }: { imageUrl: string | null }) {
  const { url, isLoading } = useMediaUrl(imageUrl);

  if (isLoading) return <ActivityIndicator />;

  return <Image source={{ uri: url || 'placeholder.jpg'} />;
}
```

### С обработкой ошибок

```typescript
import { useMediaUrl } from '@/api';

function RecipeCover({ recipe }: { recipe: RecipeResponse }) {
  const { url, isLoading, error, urlType } = useMediaUrl(
    recipe.image.cover,
    {
      placeholder: 'https://via.placeholder.com/300',
    }
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.error('Failed to load image:', error);
    return <PlaceholderImage />;
  }

  return <Image source={{ uri: url || placeholder} />;
}
```

### Использование с expo-image

```typescript
import { Image as ExpoImage } from 'expo-image';
import { useMediaUrl } from '@/api';

function OptimizedImage({ imageUrl }: { imageUrl: string }) {
  const { url } = useMediaUrl(imageUrl);

  return (
    <ExpoImage
      source={{ uri: url || 'placeholder.jpg'}
      style={{ width: 300, height: 200 }}
      contentFit="cover"
      placeholder={<ActivityIndicator />}
      transition={200}
    />
  );
}
```

### Ручная обработка (без хука)

```typescript
import {
  getMediaUrlType,
  extractMediaId,
  normalizeMediaUrl,
} from '@/api';
import { useGetMediaByIdQuery } from '@/api';

function ManualImage({ imageUrl }: { imageUrl: string }) {
  const urlType = getMediaUrlType(imageUrl);
  const isProxy = urlType === 'proxy';
  const mediaId = isProxy ? extractMediaId(imageUrl) : null;

  const { data: blob, isLoading } = useGetMediaByIdQuery(mediaId || '', {
    skip: !isProxy,
  });

  const finalUrl = useMemo(() => {
    if (urlType === 'direct') return imageUrl;
    if (blob) return URL.createObjectURL(blob);
    return 'placeholder.jpg';
  }, [imageUrl, urlType, blob]);

  return <Image source={{ uri: finalUrl }} />;
}
```

## Важные замечания

1. **Прокси URL требуют JWT токен** - автоматически добавляется через baseApi
2. **Blob URL нужно освобождать** - используйте `URL.revokeObjectURL()` при размонтировании
3. **Кэширование** - RTK Query автоматически кэширует запросы
4. **Обработка ошибок** - всегда предоставляйте placeholder для ошибок

## Обработка ошибок

```typescript
const { url, error, isLoading } = useMediaUrl(imageUrl);

// Ошибки автоматически обрабатываются RTK Query
// 401 - токен истечет, автоматически обновится
// 404 - файл не найден
// 503 - медиа сервис недоступен
```

## Оптимизация

1. **Lazy loading** - загружайте изображения только когда они видны
2. **Placeholder** - показывайте placeholder пока загружается
3. **Кэширование** - RTK Query автоматически кэширует blob данные
4. **Prefetch** - предзагружайте изображения для следующего экрана
