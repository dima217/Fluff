import { baseApi } from "../baseApi";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetMediaByIdQuery, useLazyGetMediaByIdQuery } = mediaApi;
