import { baseApi } from "../baseApi";
import type { FavoriteItem, FavoriteType } from "../types";

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all favorites
    getAllFavorites: builder.query<FavoriteItem[], void>({
      query: () => "/favorites",
      providesTags: ["Favorite"],
    }),

    // Add to favorites
    addToFavorites: builder.mutation<void, { type: FavoriteType; id: number }>({
      query: ({ type, id }) => ({
        url: `/favorites/${type}/${id}`,
        method: "POST",
      }),
      async onQueryStarted({ type, id }, { dispatch, queryFulfilled }) {
        const patches: { undo: () => void }[] = [];

        if (type === "recipe") {
          // Optimistically update getRecipeById cache
          const patch1 = dispatch(
            (baseApi.util.updateQueryData as any)(
              "getRecipeById",
              id,
              (draft: any) => {
                if (draft) {
                  draft.favorite = true;
                }
              }
            )
          );
          patches.push(patch1);
        } else if (type === "product") {
          // Optimistically update getProductById cache
          const patch1 = dispatch(
            (baseApi.util.updateQueryData as any)(
              "getProductById",
              id,
              (draft: any) => {
                if (draft) {
                  draft.favorite = true;
                }
              }
            )
          );
          patches.push(patch1);
        }

        try {
          await queryFulfilled;
        } catch {
          // Revert all patches on error
          patches.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { type, id }) => [
        "Favorite",
        { type: type === "recipe" ? "Recipe" : "Product", id },
        "Recipe", // Invalidate all Recipe queries to update search results
      ],
    }),

    // Remove from favorites
    removeFromFavorites: builder.mutation<
      void,
      { type: FavoriteType; id: number }
    >({
      query: ({ type, id }) => ({
        url: `/favorites/${type}/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ type, id }, { dispatch, queryFulfilled }) {
        const patches: { undo: () => void }[] = [];

        if (type === "recipe") {
          // Optimistically update getRecipeById cache
          const patch1 = dispatch(
            (baseApi.util.updateQueryData as any)(
              "getRecipeById",
              id,
              (draft: any) => {
                if (draft) {
                  draft.favorite = false;
                }
              }
            )
          );
          patches.push(patch1);
        } else if (type === "product") {
          // Optimistically update getProductById cache
          const patch1 = dispatch(
            (baseApi.util.updateQueryData as any)(
              "getProductById",
              id,
              (draft: any) => {
                if (draft) {
                  draft.favorite = false;
                }
              }
            )
          );
          patches.push(patch1);
        }

        try {
          await queryFulfilled;
        } catch {
          // Revert all patches on error
          patches.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { type, id }) => [
        "Favorite",
        { type: type === "recipe" ? "Recipe" : "Product", id },
        "Recipe", // Invalidate all Recipe queries to update search results
      ],
    }),
  }),
});

export const {
  useGetAllFavoritesQuery,
  useLazyGetAllFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = favoritesApi;
