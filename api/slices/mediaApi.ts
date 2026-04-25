import { baseApi } from "../baseApi";
import type { CreateMediaRequest, CreateMediaResponse } from "../types";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create generic media upload (avatar, etc)
    createMedia: builder.mutation<CreateMediaResponse, CreateMediaRequest>({
      query: (body) => ({
        url: "/media/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Media"],
    }),

    // Mark media as uploaded
    markMediaUploaded: builder.mutation<{ success: boolean }, string>({
      query: (mediaId) => ({
        url: `/media/mark-uploaded/${mediaId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, mediaId) => [{ type: "Media", id: mediaId }],
    }),

    // Get media file by mediaId (proxy to media service)
    // Requires JWT token in Authorization header
    getMediaById: builder.query<Blob, string>({
      query: (mediaId) => ({
        url: `/media/${mediaId}`,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch media: ${response.statusText}`);
          }
          return await response.blob();
        },
      }),
      providesTags: (result, error, mediaId) => [
        { type: "Media", id: mediaId },
      ],
    }),
  }),
});

export const {
  useCreateMediaMutation,
  useMarkMediaUploadedMutation,
  useGetMediaByIdQuery,
  useLazyGetMediaByIdQuery,
} = mediaApi;
