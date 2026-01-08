/**
 * Примеры использования API
 * Эти примеры показывают, как использовать RTK Query хуки в компонентах
 */

import {
  uploadFile,
  useConfirmRecipeUploadMutation,
  useCreateRecipeWithMediaIdsMutation,
  useGetProfileQuery,
  useGetRecipesQuery,
  useLoginMutation,
  useMarkUploadedMutation,
  usePrepareRecipeUploadMutation,
} from "./index";
import type { ReactNativeFile } from "./utils/fileUpload";

// Пример 1: Получение списка рецептов
export function useRecipesExample() {
  const { data: recipes, isLoading, error, refetch } = useGetRecipesQuery();

  return {
    recipes: recipes || [],
    isLoading,
    error,
    refetch,
  };
}

// Пример 2: Вход в систему
export function useLoginExample() {
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await login({ username, password }).unwrap();
      console.log("Login successful:", result);
      return result;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  return {
    login: handleLogin,
    isLoading,
    error,
  };
}

// Пример 3: Получение профиля
export function useProfileExample() {
  const { data: profile, isLoading, error } = useGetProfileQuery();

  return {
    profile,
    isLoading,
    error,
  };
}

// Пример 4: Создание рецепта с загрузкой файлов (React Native)
export function useCreateRecipeWithFilesExample() {
  const [prepareUpload] = usePrepareRecipeUploadMutation();
  const [markUploaded] = useMarkUploadedMutation();
  const [createRecipe] = useCreateRecipeWithMediaIdsMutation();
  const [confirmUpload] = useConfirmRecipeUploadMutation();

  const createRecipeWithFiles = async (
    coverFile: ReactNativeFile,
    previewFile: ReactNativeFile,
    recipeData: {
      name: string;
      recipeTypeId: number;
      calories: number;
      cookAt: number;
      productIds: number[];
      stepsConfig: any;
    }
  ) => {
    try {
      // 1. Подготовка загрузки
      const prepareResult = await prepareUpload({
        coverFilename: coverFile.name || "cover.jpg",
        coverSize: coverFile.size || 0,
        previewFilename: previewFile.name || "preview.jpg",
        previewSize: previewFile.size || 0,
      }).unwrap();

      // 2. Загрузка файлов
      await uploadFile({
        uploadUrl: prepareResult.coverUploadUrl,
        file: coverFile,
        contentType: coverFile.type,
      });

      await uploadFile({
        uploadUrl: prepareResult.previewUploadUrl,
        file: previewFile,
        contentType: previewFile.type,
      });

      // 3. Отметка загрузки
      await markUploaded(prepareResult.coverMediaId).unwrap();
      await markUploaded(prepareResult.previewMediaId).unwrap();

      // 4. Создание рецепта
      const recipe = await createRecipe({
        ...recipeData,
        imageMediaIds: {
          coverMediaId: prepareResult.coverMediaId,
          previewMediaId: prepareResult.previewMediaId,
        },
      }).unwrap();

      // 5. Финализация
      const finalRecipe = await confirmUpload({
        recipeId: recipe.id,
        mediaIds: [prepareResult.coverMediaId, prepareResult.previewMediaId],
      }).unwrap();

      return finalRecipe;
    } catch (error) {
      console.error("Failed to create recipe:", error);
      throw error;
    }
  };

  return { createRecipeWithFiles };
}
