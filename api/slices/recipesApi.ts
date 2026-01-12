import { baseApi } from "../baseApi";
import type {
  ConfirmUploadRequest,
  CreateRecipeRequest,
  CreateRecipeWithMediaIdsRequest,
  PrepareRecipeUploadRequest,
  PrepareRecipeUploadResponse,
  PrepareStepResourcesUploadRequest,
  PrepareStepResourcesUploadResponse,
  RecipeResponse,
  SearchRecipesQuery,
  UpdateRecipeRequest,
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
      invalidatesTags: ["Recipe"],
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
      invalidatesTags: ["Recipe"],
    }),

    // Delete recipe
    deleteRecipe: builder.mutation<void, number>({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipe"],
    }),

    // Get my recipes
    getMyRecipes: builder.query<RecipeResponse[], void>({
      query: () => "/recipes/my",
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
      invalidatesTags: ["Recipe"],
    }),

    // Confirm upload and finalize recipe
    confirmRecipeUpload: builder.mutation<RecipeResponse, ConfirmUploadRequest>(
      {
        query: ({ recipeId, mediaIds }) => ({
          url: `/recipes/confirm-upload/${recipeId}`,
          method: "POST",
          body: { recipeId, mediaIds },
        }),
        invalidatesTags: ["Recipe"],
      }
    ),
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
  useLazyGetMyRecipesQuery,
  useGetFavoriteRecipesQuery,
  useLazyGetFavoriteRecipesQuery,
  useSearchRecipesQuery,
  useLazySearchRecipesQuery,
  usePrepareRecipeUploadMutation,
  usePrepareStepResourcesUploadMutation,
  useMarkUploadedMutation,
  useCreateRecipeWithMediaIdsMutation,
  useConfirmRecipeUploadMutation,
} = recipesApi;
