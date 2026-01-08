import { baseApi } from "../baseApi";
import type {
  CreateTrackingRequest,
  GetTrackingStatisticsQuery,
  TrackingResponse,
  TrackingStatistics,
  UpdateTrackingRequest,
} from "../types";

export const trackingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tracking records
    getTracking: builder.query<TrackingResponse[], void>({
      query: () => "/tracking",
      providesTags: ["Tracking"],
    }),

    // Get tracking record by ID
    getTrackingById: builder.query<TrackingResponse, number>({
      query: (id) => `/tracking/${id}`,
      providesTags: (result, error, id) => [{ type: "Tracking", id }],
    }),

    // Get statistics for date range
    getStatistics: builder.query<
      TrackingStatistics,
      GetTrackingStatisticsQuery
    >({
      query: (params) => ({
        url: "/tracking/statistics",
        params: {
          dateStart: params.dateStart,
          dateEnd: params.dateEnd,
        },
      }),
      providesTags: ["Tracking"],
    }),

    // Create tracking record
    createTracking: builder.mutation<TrackingResponse, CreateTrackingRequest>({
      query: (body) => ({
        url: "/tracking",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tracking"],
    }),

    // Update tracking record
    updateTracking: builder.mutation<
      TrackingResponse,
      { id: number; data: UpdateTrackingRequest }
    >({
      query: ({ id, data }) => ({
        url: `/tracking/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tracking", id },
        "Tracking",
      ],
    }),

    // Delete tracking record
    deleteTracking: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tracking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tracking"],
    }),
  }),
});

export const {
  useGetTrackingQuery,
  useLazyGetTrackingQuery,
  useGetTrackingByIdQuery,
  useLazyGetTrackingByIdQuery,
  useGetStatisticsQuery,
  useLazyGetStatisticsQuery,
  useCreateTrackingMutation,
  useUpdateTrackingMutation,
  useDeleteTrackingMutation,
} = trackingApi;
