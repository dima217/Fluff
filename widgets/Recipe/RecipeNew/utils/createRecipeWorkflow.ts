import type {
  ConfirmUploadRequest,
  CreateRecipeWithMediaIdsRequest,
  PrepareRecipeUploadRequest,
  PrepareRecipeUploadResponse,
  PrepareStepResourcesUploadRequest,
  PrepareStepResourcesUploadResponse,
  PrepareVideoUploadRequest,
  PrepareVideoUploadResponse,
  RecipeResponse,
} from "@/api/types";
import {
  getFilenameFromUri,
  getFileSizeFromUri,
  getFileTypeFromUri,
  ReactNativeFile,
  uploadFile,
} from "@/api/utils/fileUpload";
import { Recipe } from "@/constants/types";

function isLocalMediaUri(uri: string | undefined): boolean {
  if (!uri) return false;
  return uri.startsWith("file://") || !uri.startsWith("http");
}

export interface CreateRecipeWorkflowParams {
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
  createRecipeWithMediaIds: (params: CreateRecipeWithMediaIdsRequest) => {
    unwrap: () => Promise<RecipeResponse>;
  };
  confirmRecipeUpload: (params: ConfirmUploadRequest) => {
    unwrap: () => Promise<RecipeResponse>;
  };
}

export interface CreateRecipeWorkflowResult {
  success: boolean;
  recipe?: RecipeResponse;
  error?: string;
}

/**
 * Complete workflow for creating a recipe with media files
 * Implements the two-phase safe approach:
 * 1. Prepare uploads
 * 2. Upload files to S3
 * 3. Mark files as uploaded
 * 4. Create recipe with mediaIds
 * 5. Confirm upload and finalize recipe
 */
export async function createRecipeWorkflow(
  params: CreateRecipeWorkflowParams
): Promise<CreateRecipeWorkflowResult> {
  const {
    recipeData,
    prepareRecipeUpload,
    prepareStepResourcesUpload,
    prepareVideoUpload,
    markUploaded,
    createRecipeWithMediaIds,
    confirmRecipeUpload,
  } = params;

  try {
    console.log("[createRecipeWorkflow] Starting recipe creation workflow");

    // Validate required data
    if (!recipeData.name || !recipeData.mediaUrl) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    // Step 1: Prepare recipe image upload (cover and preview)
    // For now, we'll use the same image for both cover and preview
    const coverFilename = getFilenameFromUri(recipeData.mediaUrl);
    const coverSize = await getFileSizeFromUri(recipeData.mediaUrl);

    console.log("[createRecipeWorkflow] Step 1: Preparing recipe upload");
    const prepareUploadResult = await prepareRecipeUpload({
      coverFilename,
      coverSize,
      previewFilename: coverFilename,
      previewSize: coverSize,
    }).unwrap();

    console.log(
      "[createRecipeWorkflow] Prepare upload result:",
      prepareUploadResult
    );

    // Step 2: Prepare step resources upload
    const stepResources: {
      filename: string;
      size: number;
      type: string;
      position: number;
    }[] = [];

    if (recipeData.steps) {
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        if (step.stepMediaUrl) {
          const filename = getFilenameFromUri(step.stepMediaUrl);
          const size = await getFileSizeFromUri(step.stepMediaUrl);
          const type = getFileTypeFromUri(step.stepMediaUrl);

          stepResources.push({
            filename,
            size,
            type,
            position: i + 1,
          });
        }
      }
    }

    let stepResourcesResult: PrepareStepResourcesUploadResponse | null = null;
    if (stepResources.length > 0) {
      console.log(
        "[createRecipeWorkflow] Step 2: Preparing step resources upload"
      );
      stepResourcesResult = await prepareStepResourcesUpload({
        resources: stepResources,
      }).unwrap();
      console.log(
        "[createRecipeWorkflow] Prepare step resources result:",
        stepResourcesResult
      );
    }

    // Step 3: Upload files to S3
    console.log("[createRecipeWorkflow] Step 3: Uploading files to S3");

    // Upload cover
    await uploadFile({
      uploadUrl: prepareUploadResult.coverUploadUrl,
      file: { uri: recipeData.mediaUrl } as ReactNativeFile,
    });
    await markUploaded(prepareUploadResult.coverMediaId).unwrap();

    // Upload preview (same as cover for now)
    await uploadFile({
      uploadUrl: prepareUploadResult.previewUploadUrl,
      file: { uri: recipeData.mediaUrl } as ReactNativeFile,
    });
    await markUploaded(prepareUploadResult.previewMediaId).unwrap();

    // Upload step resources
    const allMediaIds: string[] = [
      prepareUploadResult.coverMediaId,
      prepareUploadResult.previewMediaId,
    ];

    if (stepResourcesResult && recipeData.steps) {
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        if (step.stepMediaUrl) {
          const resource = stepResourcesResult.resources.find(
            (r) => r.position === i + 1
          );
          if (resource) {
            await uploadFile({
              uploadUrl: resource.uploadUrl,
              file: { uri: step.stepMediaUrl } as ReactNativeFile,
            });
            await markUploaded(resource.mediaId).unwrap();
            allMediaIds.push(resource.mediaId);
          }
        }
      }
    }

    // Upload promotional (tutorial) video if exists (и это новый локальный файл)
    let promotionalVideoMediaId: string | undefined;
    if (recipeData.videoUrl && isLocalMediaUri(recipeData.videoUrl)) {
      const videoFilename = getFilenameFromUri(recipeData.videoUrl);
      const videoSize = await getFileSizeFromUri(recipeData.videoUrl);

      const videoPrepare = await prepareVideoUpload({
        filename: videoFilename,
        size: videoSize,
      }).unwrap();

      await uploadFile({
        uploadUrl: videoPrepare.uploadUrl,
        file: { uri: recipeData.videoUrl } as ReactNativeFile,
      });
      await markUploaded(videoPrepare.mediaId).unwrap();
      promotionalVideoMediaId = videoPrepare.mediaId;
      allMediaIds.push(videoPrepare.mediaId);
    }

    // Step 4: Create recipe with mediaIds
    console.log("[createRecipeWorkflow] Step 4: Creating recipe with mediaIds");

    // Map steps to API format
    const stepsConfig = {
      steps: (recipeData.steps || []).map((step, index) => {
        const resources: {
          position: number;
          mediaId: string;
          type: string;
        }[] = [];

        if (step.stepMediaUrl && stepResourcesResult) {
          const resource = stepResourcesResult.resources.find(
            (r) => r.position === index + 1
          );
          if (resource) {
            resources.push({
              position: index + 1,
              mediaId: resource.mediaId,
              type: resource.type,
            });
          }
        }

        return {
          name: step.title,
          description: step.description,
          resources,
        };
      }),
    };

    // Parse ingredients string into customProducts array
    // Split by comma, newline, or semicolon, then trim and filter empty strings
    const customProducts = recipeData.ingredients
      ? recipeData.ingredients
          .split(/[,\n;]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      : [];

    const createRecipeResult = await createRecipeWithMediaIds({
      name: recipeData.name!,
      recipeTypeId: 1, // TODO: Get from form or default
      imageMediaIds: {
        coverMediaId: prepareUploadResult.coverMediaId,
        previewMediaId: prepareUploadResult.previewMediaId,
      },
      promotionalVideoMediaId,
      description: recipeData.ingredients, // Using ingredients as description for now
      // TODO: Add support for productIds (products from database)
      // productIds: [], // Will be implemented later
      customProducts, // Using custom products from ingredients string
      calories: recipeData.ccal || 0,
      cookAt: 0, // TODO: Get from form
      stepsConfig,
    }).unwrap();

    console.log("[createRecipeWorkflow] Recipe created:", createRecipeResult);

    // Step 5: Confirm upload and finalize recipe
    console.log(
      "[createRecipeWorkflow] Step 5: Confirming upload and finalizing recipe"
    );
    const finalizedRecipe = await confirmRecipeUpload({
      recipeId: createRecipeResult.id,
      mediaIds: allMediaIds,
    }).unwrap();

    console.log("[createRecipeWorkflow] Recipe finalized:", finalizedRecipe);

    return {
      success: true,
      recipe: finalizedRecipe,
    };
  } catch (error: any) {
    console.error("[createRecipeWorkflow] Error creating recipe:", error);
    return {
      success: false,
      error:
        error?.data?.message || error?.message || "Failed to create recipe",
    };
  }
}
