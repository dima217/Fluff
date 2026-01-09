# Быстрый старт API клиента

## Установка

Зависимости уже установлены:

- `@reduxjs/toolkit`
- `react-redux`

## Базовая настройка

Redux Provider уже добавлен в `app/_layout.tsx`. Ничего дополнительно настраивать не нужно.

## Использование

### 1. Импорт хуков

```typescript
import {
  useGetRecipesQuery,
  useLoginMutation,
  useGetProfileQuery,
} from "@/api";
```

### 2. Получение данных (Query)

```typescript
function RecipesList() {
  const { data, isLoading, error } = useGetRecipesQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error</Text>;

  return (
    <View>
      {data?.map(recipe => (
        <Text key={recipe.id}>{recipe.name}</Text>
      ))}
    </View>
  );
}
```

### 3. Изменение данных (Mutation)

```typescript
function LoginScreen() {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const result = await login({
        username: 'user@example.com', // username is email
        password: 'password',
      }).unwrap();

      // Токены автоматически сохраняются
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <Button onPress={handleLogin} disabled={isLoading} />;
}
```

### 4. Конфигурация базового URL

Измените в `api/config.ts`:

```typescript
baseUrl: __DEV__
  ? 'http://localhost:3000'  // Development
  : 'https://api.yourdomain.com',  // Production
```

## Доступные API

### Аутентификация

- `useSignUpInitMutation` - Инициализация регистрации
- `useSignUpMutation` - Регистрация
- `useLoginMutation` - Вход
- `useLogoutMutation` - Выход
- `useRecoveryInitMutation` - Восстановление пароля (инициализация)
- `useRecoveryConfirmMutation` - Восстановление пароля (подтверждение)
- `useOauthLoginMutation` - OAuth вход

### Профиль

- `useGetProfileQuery` - Получить профиль
- `useUpdateProfileMutation` - Обновить профиль

### Рецепты

- `useGetRecipesQuery` - Получить все рецепты
- `useGetRecipeByIdQuery` - Получить рецепт по ID
- `useGetMyRecipesQuery` - Получить рецепты текущего пользователя
- `useGetFavoriteRecipesQuery` - Получить избранные рецепты
- `useSearchRecipesQuery` - Поиск рецептов по продуктам и названию
- `useCreateRecipeMutation` - Создать рецепт (с URL)
- `useCreateRecipeWithMediaIdsMutation` - Создать рецепт (с загрузкой файлов)
- `useUpdateRecipeMutation` - Обновить рецепт
- `useDeleteRecipeMutation` - Удалить рецепт
- `usePrepareRecipeUploadMutation` - Подготовка загрузки изображений
- `usePrepareStepResourcesUploadMutation` - Подготовка загрузки ресурсов шагов
- `useMarkUploadedMutation` - Отметить файл как загруженный
- `useConfirmRecipeUploadMutation` - Финализировать рецепт

### Продукты

- `useGetProductsQuery` - Получить все продукты
- `useGetProductByIdQuery` - Получить продукт по ID
- `useCreateProductMutation` - Создать продукт (с URL)
- `useCreateProductWithMediaIdsMutation` - Создать продукт (с загрузкой файлов)
- `useUpdateProductMutation` - Обновить продукт
- `useDeleteProductMutation` - Удалить продукт
- `useGetFavoriteProductsQuery` - Получить избранные продукты
- `usePrepareProductUploadMutation` - Подготовка загрузки изображений
- `useMarkProductUploadedMutation` - Отметить файл как загруженный
- `useConfirmProductUploadMutation` - Финализировать продукт

### Трекинг калорий

- `useGetTrackingQuery` - Получить записи трекинга
- `useGetTrackingByIdQuery` - Получить запись по ID
- `useGetStatisticsQuery` - Получить статистику за период (dateStart, dateEnd)
- `useCreateTrackingMutation` - Создать запись (name, calories)
- `useUpdateTrackingMutation` - Обновить запись
- `useDeleteTrackingMutation` - Удалить запись

### Избранное

- `useGetAllFavoritesQuery` - Получить все избранное
- `useAddToFavoritesMutation` - Добавить в избранное
- `useRemoveFromFavoritesMutation` - Удалить из избранного

### Медиа

- `useGetMediaByIdQuery` - Получить медиа файл по mediaId (прокси к медиа сервису)
- `useMediaUrl` - Универсальный хук для работы с медиа URL (автоматически обрабатывает прокси и прямые URL)

## Автоматические функции

- ✅ Автоматическое добавление токена в заголовки
- ✅ Автоматическое обновление токена при 401 ошибке
- ✅ Автоматическое кэширование запросов
- ✅ Автоматическая инвалидация кэша при мутациях

## Примеры

См. `api/examples.ts` для более подробных примеров использования.
