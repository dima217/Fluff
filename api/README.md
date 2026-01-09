# Fluff API Client

RTK Query API клиент для работы с бекендом приложения Fluff.

## Установка

Зависимости уже установлены:
- `@reduxjs/toolkit`
- `react-redux`

## Структура

```
api/
├── baseApi.ts          # Базовый API клиент с RTK Query
├── store.ts            # Redux store
├── config.ts           # Конфигурация API
├── types/              # TypeScript типы
│   └── index.ts
├── slices/             # API slices
│   ├── authApi.ts      # Аутентификация
│   ├── profileApi.ts   # Профиль пользователя
│   ├── recipesApi.ts   # Рецепты
│   ├── productsApi.ts  # Продукты
│   ├── trackingApi.ts  # Трекинг калорий
│   └── favoritesApi.ts # Избранное
├── utils/              # Утилиты
│   ├── tokenStorage.ts # Хранение токенов
│   └── fileUpload.ts   # Загрузка файлов
└── hooks.ts            # Типизированные хуки Redux
```

## Использование

### Базовое использование

```typescript
import { useGetRecipesQuery, useLoginMutation } from '@/api';

function RecipesList() {
  const { data, isLoading, error } = useGetRecipesQuery();
  
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <View>
      {data?.map(recipe => (
        <Text key={recipe.id}>{recipe.name}</Text>
      ))}
    </View>
  );
}
```

### Аутентификация

```typescript
import { useLoginMutation } from '@/api';

function LoginScreen() {
  const [login, { isLoading }] = useLoginMutation();
  
  const handleLogin = async () => {
    try {
      const result = await login({
        email: 'user@example.com',
        password: 'password123',
      }).unwrap();
      
      // Токены автоматически сохраняются
      console.log('Logged in:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return <Button onPress={handleLogin} disabled={isLoading} />;
}
```

### Создание рецепта с загрузкой файлов

```typescript
import {
  usePrepareRecipeUploadMutation,
  useMarkUploadedMutation,
  useCreateRecipeWithMediaIdsMutation,
  useConfirmRecipeUploadMutation,
  uploadFile,
} from '@/api';

function CreateRecipeScreen() {
  const [prepareUpload] = usePrepareRecipeUploadMutation();
  const [markUploaded] = useMarkUploadedMutation();
  const [createRecipe] = useCreateRecipeWithMediaIdsMutation();
  const [confirmUpload] = useConfirmRecipeUploadMutation();
  
  const handleCreateRecipe = async (coverFile: File, previewFile: File) => {
    try {
      // 1. Подготовка загрузки
      const prepareResult = await prepareUpload({
        coverFilename: coverFile.name,
        coverSize: coverFile.size,
        previewFilename: previewFile.name,
        previewSize: previewFile.size,
      }).unwrap();
      
      // 2. Загрузка файлов
      await uploadFile({
        uploadUrl: prepareResult.coverUploadUrl,
        file: coverFile,
      });
      
      await uploadFile({
        uploadUrl: prepareResult.previewUploadUrl,
        file: previewFile,
      });
      
      // 3. Отметка загрузки
      await markUploaded(prepareResult.coverMediaId).unwrap();
      await markUploaded(prepareResult.previewMediaId).unwrap();
      
      // 4. Создание рецепта
      const recipe = await createRecipe({
        name: 'My Recipe',
        recipeTypeId: 1,
        imageMediaIds: {
          coverMediaId: prepareResult.coverMediaId,
          previewMediaId: prepareResult.previewMediaId,
        },
        calories: 500,
        cookAt: 3600,
        productIds: [1, 2, 3],
        stepsConfig: {
          steps: [],
        },
      }).unwrap();
      
      // 5. Финализация
      const finalRecipe = await confirmUpload({
        recipeId: recipe.id,
        mediaIds: [
          prepareResult.coverMediaId,
          prepareResult.previewMediaId,
        ],
      }).unwrap();
      
      console.log('Recipe created:', finalRecipe);
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };
}
```

### Работа с избранным

```typescript
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetFavoriteStatusQuery,
} from '@/api';

function RecipeCard({ recipeId }: { recipeId: number }) {
  const { data: favoriteStatus } = useGetFavoriteStatusQuery({
    type: 'recipe',
    id: recipeId,
  });
  
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  
  const handleToggleFavorite = async () => {
    if (favoriteStatus?.isFavorite) {
      await removeFromFavorites({ type: 'recipe', id: recipeId });
    } else {
      await addToFavorites({ type: 'recipe', id: recipeId });
    }
  };
  
  return (
    <Button
      onPress={handleToggleFavorite}
      title={favoriteStatus?.isFavorite ? 'Remove' : 'Add'}
    />
  );
}
```

### Трекинг калорий

```typescript
import {
  useGetDailyStatisticsQuery,
  useCreateTrackingMutation,
} from '@/api';

function TrackingScreen() {
  const { data: calendar } = useGetCalendarQuery();
  const [createTracking] = useCreateTrackingMutation();
  
  // Создать запись из рецепта
  const handleAddRecipe = async (recipeId: number) => {
    await createTracking({ recipeId }).unwrap();
  };
  
  // Создать кастомную запись
  const handleAddCustom = async (name: string, calories: number) => {
    await createTracking({ name, calories }).unwrap();
  };
  
  return (
    <View>
      <Text>Calendar: {JSON.stringify(calendar)}</Text>
      <Button onPress={() => handleAddCustom("Breakfast", 500)} title="Add 500 kcal" />
      <Button onPress={() => handleAddRecipe(1)} title="Add Recipe" />
    </View>
  );
}
```

## Конфигурация

Измените базовый URL в `api/config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: __DEV__ 
    ? 'http://localhost:3000'  // Development
    : 'https://api.yourdomain.com',  // Production
};
```

## Автоматическое обновление токенов

API клиент автоматически обновляет access token при получении 401 ошибки, используя refresh token из cookie. Токены хранятся в SecureStore.

## Кэширование

RTK Query автоматически кэширует запросы. Данные обновляются при:
- Мутациях (create, update, delete)
- Инвалидации тегов
- Ручном обновлении через `refetch()`

## Работа с медиа файлами

API может возвращать два типа URL для медиа файлов:

1. **Прямые URL** - внешние ссылки (`https://example.com/image.jpg`)
2. **Прокси URL** - ссылки через API (`/api/media/{mediaId}`)

### Использование хука useMediaUrl

```typescript
import { useMediaUrl } from '@/api';
import { Image } from 'react-native';

function RecipeImage({ imageUrl }: { imageUrl: string | null }) {
  const { url, isLoading, error } = useMediaUrl(imageUrl, {
    placeholder: 'https://via.placeholder.com/300',
  });

  if (isLoading) return <ActivityIndicator />;
  if (error || !url) return <PlaceholderImage />;

  return <Image source={{ uri: url }} />;
}
```

Хук автоматически:
- Определяет тип URL (прокси или прямой)
- Загружает прокси URL через API с авторизацией
- Загружает прямые URL напрямую
- Создает blob URL для использования в компонентах
- Обрабатывает ошибки и состояния загрузки

### Утилиты для работы с медиа URL

```typescript
import {
  getMediaUrlType,
  isProxyUrl,
  isDirectUrl,
  extractMediaId,
  normalizeMediaUrl,
} from '@/api';

const urlType = getMediaUrlType(url); // 'proxy' | 'direct' | 'invalid'
const mediaId = extractMediaId('/api/media/123'); // '123'
const fullUrl = normalizeMediaUrl('/api/media/123'); // 'http://localhost:3000/api/media/123'
```

Подробнее см. `api/utils/mediaUrl.md` и `api/examples/mediaExamples.tsx`.

## Типы

Все типы экспортируются из `@/api/types`:

```typescript
import type {
  RecipeResponse,
  ProductResponse,
  ProfileResponse,
  TrackingResponse,
} from '@/api/types';
```

