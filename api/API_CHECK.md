# Проверка соответствия API спецификации

## ✅ Проверенные эндпоинты

### Аутентификация
- ✅ `POST /user/sign-up-init` - Инициализация регистрации
- ✅ `POST /user/sign-up` - Регистрация
- ✅ `POST /user/sign-in` - Вход (было `/user/login`)
- ✅ `POST /user/sign-out` - Выход (было `/user/logout`)
- ✅ `POST /user/new-access-token` - Обновление токена (было `/user/refresh`, возвращает строку)
- ✅ `POST /user/recovery-init` - Восстановление пароля (инициализация)
- ✅ `POST /user/recovery-confirm` - Восстановление пароля (подтверждение)
- ✅ `POST /oauth/login` - OAuth вход

### Профиль
- ✅ `GET /user/profile` - Получить профиль (было `/profile`)
- ✅ `PUT /user/profile` - Обновить профиль (было `/profile`)

### Рецепты
- ✅ `GET /recipes` - Получить все рецепты
- ✅ `GET /recipes/{id}` - Получить рецепт по ID
- ✅ `GET /recipes/my` - Получить рецепты текущего пользователя
- ✅ `GET /recipes/favorites` - Получить избранные рецепты
- ✅ `GET /recipes/search?q=...` - **НОВЫЙ** Поиск рецептов
- ✅ `POST /recipes` - Создать рецепт (legacy)
- ✅ `POST /recipes/prepare-upload` - Подготовка загрузки изображений
- ✅ `POST /recipes/prepare-step-resources-upload` - Подготовка загрузки ресурсов шагов
- ✅ `POST /recipes/mark-uploaded/{mediaId}` - Отметить файл как загруженный
- ✅ `POST /recipes/create-with-media-ids` - Создать рецепт с mediaIds
- ✅ `POST /recipes/confirm-upload/{recipeId}` - Финализировать рецепт
- ✅ `PUT /recipes/{id}` - Обновить рецепт
- ✅ `DELETE /recipes/{id}` - Удалить рецепт

### Продукты
- ✅ `GET /products` - Получить все продукты
- ✅ `GET /products/{id}` - Получить продукт по ID
- ✅ `GET /products/favorites` - Получить избранные продукты
- ✅ `GET /products/search?q=...` - **НОВЫЙ** Поиск продуктов
- ✅ `POST /products` - Создать продукт (legacy)
- ✅ `POST /products/prepare-upload` - Подготовка загрузки изображений
- ✅ `POST /products/mark-uploaded/{mediaId}` - Отметить файл как загруженный
- ✅ `POST /products/create-with-media-ids` - Создать продукт с mediaIds
- ✅ `POST /products/confirm-upload/{productId}` - Финализировать продукт
- ✅ `PUT /products/{id}` - Обновить продукт
- ✅ `DELETE /products/{id}` - Удалить продукт

### Трекинг калорий
- ✅ `GET /tracking` - Получить все записи
- ✅ `GET /tracking/{id}` - Получить запись по ID
- ✅ `GET /tracking/statistics?dateStart=...&dateEnd=...` - Статистика (было `/tracking/statistics/day`)
- ✅ `POST /tracking` - Создать запись (name, calories)
- ✅ `PUT /tracking/{id}` - Обновить запись
- ✅ `DELETE /tracking/{id}` - Удалить запись

### Избранное
- ✅ `GET /favorites` - Получить все избранное
- ✅ `POST /favorites/{type}/{id}` - Добавить в избранное
- ✅ `DELETE /favorites/{type}/{id}` - Удалить из избранного

### Медиа
- ✅ `GET /media/{mediaId}` - Получить медиа файл (прокси к медиа сервису)

## 🔄 Изменения в типах

### Аутентификация
- `LoginRequest.email` → `LoginRequest.username`
- `AuthResponse.accessToken` → `AuthResponse.access`
- `AuthResponse.refreshToken` → `AuthResponse.refresh`
- `RecoveryConfirmRequest.newPassword` → `RecoveryConfirmRequest.password` + `passwordConfirm`

### Трекинг
- `TrackingResponse.date` → удалено
- `TrackingResponse.userId` → удалено
- `TrackingResponse.updatedAt` → удалено
- `TrackingResponse.name` → добавлено
- `TrackingResponse.created` → добавлено (вместо `createdAt`)
- `CreateTrackingRequest.date` → удалено
- `CreateTrackingRequest.name` → добавлено
- `TrackingStatistics.date` → `TrackingStatistics.dateStart` + `dateEnd`

## 📝 Новые эндпоинты

1. **Поиск рецептов**: `GET /recipes/search?q=...`
   - Поиск по продуктам и названию рецепта
   - Хук: `useSearchRecipesQuery`, `useLazySearchRecipesQuery`

2. **Поиск продуктов**: `GET /products/search?q=...`
   - Поиск по названию продукта
   - Хук: `useSearchProductsQuery`, `useLazySearchProductsQuery`

## ✅ Все эндпоинты соответствуют спецификации

