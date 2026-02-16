import type {
  PrepareRecipeUploadRequest,
  PrepareRecipeUploadResponse,
  PrepareStepResourcesUploadRequest,
  PrepareStepResourcesUploadResponse,
  PrepareVideoUploadRequest,
  PrepareVideoUploadResponse,
  RecipeResponse,
  RecipeStepResource,
  UpdateRecipeRequest,
} from "@/api/types";
import {
  getFilenameFromUri,
  getFileSizeFromUri,
  getFileTypeFromUri,
  ReactNativeFile,
  uploadFile,
} from "@/api/utils/fileUpload";
import { Recipe } from "@/constants/types";

function isNewLocalMedia(uri: string | undefined): boolean {
  if (!uri) return false;
  return uri.startsWith("file://") || !uri.startsWith("http");
}

export interface UpdateRecipeWorkflowParams {
  recipeId: number;
  existingRecipe: RecipeResponse;
  recipeData: Partial<Recipe>;
  prepareRecipeUpload: (params: PrepareRecipeUploadRequest) => {
    unwrap: () => Promise<PrepareRecipeUploadResponse>;
  };
  prepareStepResourcesUpload: (params: PrepareStepResourcesUploadRequest) => {
    unwrap: () => Promise<PrepareStepResourcesUploadResponse>;
  };
  prepareVideoUpload: (params: PrepareVideoUploadRequest) => {
    unwrap: () => Promise<PrepareVideoUploadResponse>;
  };
  markUploaded: (mediaId: string) => {
    unwrap: () => Promise<{ success: boolean }>;
  };
  updateRecipe: (params: { id: number; data: UpdateRecipeRequest }) => {
    unwrap: () => Promise<RecipeResponse>;
  };
}

export interface UpdateRecipeWorkflowResult {
  success: boolean;
  recipe?: RecipeResponse;
  error?: string;
}

/**
 * Обновление рецепта.
 * - Картинка (cover/preview) загружается заново, только если пришёл новый локальный файл.
 * - Видео загружается заново, только если пришёл новый локальный файл.
 * - stepsConfig: обновляем текст шагов, при этом медиа шагов сохраняем из существующего рецепта.
 */
export async function updateRecipeWorkflow(
  params: UpdateRecipeWorkflowParams
): Promise<UpdateRecipeWorkflowResult> {
  const {
    recipeId,
    existingRecipe,
    recipeData,
    prepareRecipeUpload,
    prepareStepResourcesUpload,
    prepareVideoUpload,
    markUploaded,
    updateRecipe,
  } = params;

  try {
    let coverUrl = existingRecipe.image.cover;
    let previewUrl = existingRecipe.image.preview;
    let promotionalVideo: string | null = existingRecipe.promotionalVideo ?? null;

    // Обновляем обложку, только если пришёл новый локальный файл
    if (isNewLocalMedia(recipeData.mediaUrl)) {
      const coverFilename = getFilenameFromUri(recipeData.mediaUrl!);
      const coverSize = await getFileSizeFromUri(recipeData.mediaUrl!);

      const prepareUploadResult = await prepareRecipeUpload({
        coverFilename,
        coverSize,
        previewFilename: coverFilename,
        previewSize: coverSize,
      }).unwrap();

      await uploadFile({
        uploadUrl: prepareUploadResult.coverUploadUrl,
        file: { uri: recipeData.mediaUrl! } as ReactNativeFile,
      });
      await markUploaded(prepareUploadResult.coverMediaId).unwrap();

      await uploadFile({
        uploadUrl: prepareUploadResult.previewUploadUrl,
        file: { uri: recipeData.mediaUrl! } as ReactNativeFile,
      });
      await markUploaded(prepareUploadResult.previewMediaId).unwrap();

      coverUrl = prepareUploadResult.coverUrl;
      previewUrl = prepareUploadResult.previewUrl;
    }

    // Обновляем промо‑видео, только если пришёл новый локальный файл
    if (isNewLocalMedia(recipeData.videoUrl)) {
      const videoFilename = getFilenameFromUri(recipeData.videoUrl!);
      const videoSize = await getFileSizeFromUri(recipeData.videoUrl!);

      const videoPrepare = await prepareVideoUpload({
        filename: videoFilename,
        size: videoSize,
      }).unwrap();

      await uploadFile({
        uploadUrl: videoPrepare.uploadUrl,
        file: { uri: recipeData.videoUrl! } as ReactNativeFile,
      });
      await markUploaded(videoPrepare.mediaId).unwrap();

      promotionalVideo = videoPrepare.url;
    }

    // Шаги: загружаем медиа для новых шагов и для шагов с заменённым локальным медиа
    const steps = recipeData.steps ?? [];
    const stepResourcesToUpload: {
      filename: string;
      size: number;
      type: string;
      position: number;
    }[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.stepMediaUrl && isNewLocalMedia(step.stepMediaUrl)) {
        stepResourcesToUpload.push({
          filename: getFilenameFromUri(step.stepMediaUrl),
          size: await getFileSizeFromUri(step.stepMediaUrl),
          type: getFileTypeFromUri(step.stepMediaUrl),
          position: i + 1,
        });
      }
    }

    let stepResourcesResult: PrepareStepResourcesUploadResponse | null = null;
    if (stepResourcesToUpload.length > 0) {
      stepResourcesResult = await prepareStepResourcesUpload({
        resources: stepResourcesToUpload,
      }).unwrap();

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.stepMediaUrl && isNewLocalMedia(step.stepMediaUrl)) {
          const resource = stepResourcesResult!.resources.find(
            (r) => r.position === i + 1
          );
          if (resource) {
            await uploadFile({
              uploadUrl: resource.uploadUrl,
              file: { uri: step.stepMediaUrl } as ReactNativeFile,
            });
            await markUploaded(resource.mediaId).unwrap();
          }
        }
      }
    }

    // stepsConfig: текст из формы; ресурсы — загруженные для шага или из существующего рецепта
    const stepsConfig = {
      steps: steps.map((step, index) => {
        const existingStep = existingRecipe.stepsConfig?.steps?.[index];
        let resources: RecipeStepResource[] = existingStep?.resources ?? [];

        if (stepResourcesResult) {
          const uploaded = stepResourcesResult.resources.find(
            (r) => r.position === index + 1
          );
          if (uploaded) {
            resources = [
              {
                position: index + 1,
                source: uploaded.url,
                type: uploaded.type,
              },
            ];
          }
        }

        return {
          name: step.title,
          description: step.description,
          resources,
        };
      }),
    };

    // Если шаги не пришли из формы — оставляем stepsConfig как есть
    if (
      stepsConfig.steps.length === 0 &&
      existingRecipe.stepsConfig?.steps?.length
    ) {
      stepsConfig.steps = existingRecipe.stepsConfig.steps;
    }

    const updatePayload: UpdateRecipeRequest = {
      name: recipeData.name ?? existingRecipe.name,
      recipeTypeId: existingRecipe.type.id,
      image: { cover: coverUrl, preview: previewUrl },
      promotionalVideo,
      description: recipeData.ingredients ?? existingRecipe.description ?? null,
      productIds: existingRecipe.products,
      calories: recipeData.ccal ?? existingRecipe.calories,
      cookAt: existingRecipe.cookAt,
      stepsConfig,
    };

    const updated = await updateRecipe({ id: recipeId, data: updatePayload }).unwrap();

    return {
      success: true,
      recipe: updated,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.data?.message || error?.message || "Failed to update recipe",
    };
  }
}

