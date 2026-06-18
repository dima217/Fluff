import { baseApi } from "../baseApi";
import {
  RateRecipeRequest,
  RateRecipeResponse,
  type ConfirmUploadRequest,
  type CreateRecipeRequest,
  type CreateRecipeWithMediaIdsRequest,
  type PrepareRecipeUploadRequest,
  type PrepareRecipeUploadResponse,
  type PrepareStepResourcesUploadRequest,
  type PrepareStepResourcesUploadResponse,
  type PrepareVideoUploadRequest,
  type PrepareVideoUploadResponse,
  type RecipeResponse,
  type SearchRecipesQuery,
  type UpdateRecipeRequest,
} from "../types";

export const recipesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all recipes
    getRecipes: builder.query<RecipeResponse[], void>({
      query: () => "/recipes",
      providesTags: ["Recipe"],
    }),

    // Get recipe by ID
    getRecipeById: builder.query<RecipeResponse, number>({
      query: (id) => `/recipes/${id}`,
      providesTags: (result, error, id) => [{ type: "Recipe", id }],
    }),

    // Create recipe (direct URL method)
    createRecipe: builder.mutation<RecipeResponse, CreateRecipeRequest>({
      query: (body) => ({
        url: "/recipes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recipe", "MyRecipes"],
    }),

    // Update recipe
    updateRecipe: builder.mutation<
      RecipeResponse,
      { id: number; data: UpdateRecipeRequest }
    >({
      query: ({ id, data }) => ({
        url: `/recipes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Recipe", "MyRecipes"],
    }),

    // Delete recipe
    deleteRecipe: builder.mutation<void, number>({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipe"],
    }),

    // Get my recipes (инвалидируется при создании рецепта)
    getMyRecipes: builder.query<RecipeResponse[], void>({
      query: () => "/recipes/my",
      providesTags: ["Recipe", "MyRecipes"],
    }),

    // Get recipes by ids
    getRecipesByIds: builder.query<RecipeResponse[], number[]>({
      query: (ids) => `/recipes/ids?ids=${ids.join(",")}`,
      providesTags: ["Recipe"],
    }),

    // Get favorite recipes
    getFavoriteRecipes: builder.query<RecipeResponse[], void>({
      query: () => "/recipes/favorites",
      providesTags: ["Recipe", "Favorite"],
    }),

    // Search recipes
    searchRecipes: builder.query<
      RecipeResponse[] | { data: RecipeResponse[]; meta: any },
      SearchRecipesQuery
    >({
      query: (params) => {
        const queryParams: any = {};
        if (params.q) {
          queryParams.q = params.q;
        }
        if (params.productIds && params.productIds.length > 0) {
          queryParams.productIds = params.productIds.join(",");
        }
        if (params.page) {
          queryParams.page = params.page;
        }
        if (params.limit) {
          queryParams.limit = params.limit;
        }

        return {
          url: "/recipes/search",
          params: queryParams,
        };
      },
      providesTags: ["Recipe"],
    }),

    // Prepare recipe image upload
    prepareRecipeUpload: builder.mutation<
      PrepareRecipeUploadResponse,
      PrepareRecipeUploadRequest
    >({
      query: (body) => ({
        url: "/recipes/prepare-upload",
        method: "POST",
        body,
      }),
    }),

    // Prepare step resources upload
    prepareStepResourcesUpload: builder.mutation<
      PrepareStepResourcesUploadResponse,
      PrepareStepResourcesUploadRequest
    >({
      query: (body) => ({
        url: "/recipes/prepare-step-resources-upload",
        method: "POST",
        body,
      }),
    }),

    prepareVideoUpload: builder.mutation<
      PrepareVideoUploadResponse,
      PrepareVideoUploadRequest
    >({
      query: (body) => ({
        url: "/recipes/prepare-video-upload",
        method: "POST",
        body,
      }),
    }),

    // Mark file as uploaded
    markUploaded: builder.mutation<{ success: boolean }, string>({
      query: (mediaId) => ({
        url: `/recipes/mark-uploaded/${mediaId}`,
        method: "POST",
      }),
    }),

    // Create recipe with media IDs
    createRecipeWithMediaIds: builder.mutation<
      RecipeResponse,
      CreateRecipeWithMediaIdsRequest
    >({
      query: (body) => ({
        url: "/recipes/create-with-media-ids",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recipe", "MyRecipes"],
    }),

    // Confirm upload and finalize recipe
    confirmRecipeUpload: builder.mutation<RecipeResponse, ConfirmUploadRequest>(
      {
        query: ({ recipeId, mediaIds }) => ({
          url: `/recipes/confirm-upload/${recipeId}`,
          method: "POST",
          body: { recipeId, mediaIds },
        }),
        invalidatesTags: ["Recipe", "MyRecipes"],
      }
    ),
    rateRecipe: builder.mutation<RateRecipeResponse, RateRecipeRequest>({
      query: ({ recipeId, value }) => ({
        url: `/recipes/${recipeId}/rate`,
        method: "POST",
        body: { value },
      }),
      invalidatesTags: ["Recipe", "MyRecipes"],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useLazyGetRecipesQuery,
  useGetRecipeByIdQuery,
  useLazyGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useGetMyRecipesQuery,
  useGetRecipesByIdsQuery,
  useLazyGetMyRecipesQuery,
  useGetFavoriteRecipesQuery,
  useLazyGetFavoriteRecipesQuery,
  useSearchRecipesQuery,
  useLazySearchRecipesQuery,
  usePrepareRecipeUploadMutation,
  usePrepareStepResourcesUploadMutation,
  usePrepareVideoUploadMutation,
  useMarkUploadedMutation,
  useCreateRecipeWithMediaIdsMutation,
  useConfirmRecipeUploadMutation,
  useRateRecipeMutation,
} = recipesApi;
