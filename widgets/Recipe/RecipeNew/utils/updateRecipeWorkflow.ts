import type {
  PrepareRecipeUploadRequest,
  PrepareRecipeUploadResponse,
  RecipeResponse,
  UpdateRecipeRequest,
} from "@/api/types";
import {
  getFilenameFromUri,
  getFileSizeFromUri,
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
 * Обновление рецепта: загрузка обложки только если mediaUrl поменялся (новый файл), затем PUT.
 * Шаги и видео пока обновляются только текстом; смена медиа шагов — при необходимости отдельно.
 */
export async function updateRecipeWorkflow(
  params: UpdateRecipeWorkflowParams
): Promise<UpdateRecipeWorkflowResult> {
  const {
    recipeId,
    existingRecipe,
    recipeData,
    prepareRecipeUpload,
    markUploaded,
    updateRecipe,
  } = params;

  try {
    let coverUrl = existingRecipe.image.cover;
    let previewUrl = existingRecipe.image.preview;

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

    const stepsConfig = {
      steps: (recipeData.steps ?? []).map((step, index) => {
        const existingStep = existingRecipe.stepsConfig?.steps?.[index];
        return {
          name: step.title,
          description: step.description,
          resources: existingStep?.resources ?? [],
        };
      }),
    };

    if (stepsConfig.steps.length === 0 && existingRecipe.stepsConfig?.steps?.length) {
      stepsConfig.steps = existingRecipe.stepsConfig.steps;
    }

    const updatePayload: UpdateRecipeRequest = {
      name: recipeData.name ?? existingRecipe.name,
      recipeTypeId: existingRecipe.type.id,
      image: { cover: coverUrl, preview: previewUrl },
      promotionalVideo: existingRecipe.promotionalVideo ?? null,
      description: recipeData.ingredients ?? existingRecipe.description ?? null,
      productIds: existingRecipe.products,
      calories: recipeData.ccal ?? existingRecipe.calories,
      cookAt: existingRecipe.cookAt,
      stepsConfig,
    };

    const updated = await updateRecipe({ id: recipeId, data: updatePayload }).unwrap();
    return { success: true, recipe: updated };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.data?.message || error?.message || "Failed to update recipe",
    };
  }
}
