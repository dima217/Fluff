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
      invalidatesTags: (result, error, { type, id }) => [
        "Favorite",
        { type: type === "recipe" ? "Recipe" : "Product", id },
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
      invalidatesTags: (result, error, { type, id }) => [
        "Favorite",
        { type: type === "recipe" ? "Recipe" : "Product", id },
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
