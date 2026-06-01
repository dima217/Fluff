import { baseApi } from "../baseApi";
import { buildMediaApiUrl, MEDIA_API_PATHS } from "../config";
import type { CreateMediaRequest, CreateMediaResponse } from "../types";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMedia: builder.mutation<CreateMediaResponse, CreateMediaRequest>({
      query: (body) => ({
        url: buildMediaApiUrl(MEDIA_API_PATHS.create),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Media"],
    }),

    markMediaUploaded: builder.mutation<{ success: boolean }, string>({
      query: (mediaId) => ({
        url: buildMediaApiUrl(MEDIA_API_PATHS.markUploaded(mediaId)),
        method: "POST",
      }),
      invalidatesTags: (result, error, mediaId) => [{ type: "Media", id: mediaId }],
    }),

    getMediaById: builder.query<Blob, string>({
      query: (mediaId) => ({
        url: buildMediaApiUrl(MEDIA_API_PATHS.byId(mediaId)),
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
