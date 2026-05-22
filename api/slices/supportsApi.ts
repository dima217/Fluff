import { baseApi } from "../baseApi";
import {
  CreateTicketRequest,
  CreateTicketResponse,
  PaginationQuery,
  SupportMessagesResponse,
  SupportTicketsResponse,
} from "../types";
import { normalizeTicket, normalizeTicketsResponse } from "@/widgets/Support/lib/supportTickets";

export const supportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupportTicket: builder.mutation<
      CreateTicketResponse,
      CreateTicketRequest
    >({
      query: (body) => ({
        url: "/support/tickets",
        method: "POST",
        body,
      }),
      transformResponse: (response: CreateTicketResponse) => ({
        ...response,
        ticket: normalizeTicket(
          response.ticket as unknown as Record<string, unknown>
        ),
      }),
      invalidatesTags: ["SupportTicket"],
    }),

    getSupportTickets: builder.query<
      { data: SupportTicketsResponse["tickets"]; meta: Omit<SupportTicketsResponse, "tickets"> },
      PaginationQuery
    >({
      query: (params) => ({
        url: "/support/tickets",
        method: "GET",
        params,
      }),
      transformResponse: (response: SupportTicketsResponse) => ({
        data: normalizeTicketsResponse(response.tickets ?? response),
        meta: {
          total: response.total,
          limit: response.limit,
          offset: response.offset,
        },
      }),
      providesTags: ["SupportTicket"],
    }),

    getTicketMessages: builder.query<
      SupportMessagesResponse,
      { ticketId: number; limit?: number; beforeId?: number }
    >({
      query: ({ ticketId, limit = 50, beforeId }) => ({
        url: `/support/tickets/${ticketId}/messages`,
        params: { limit, ...(beforeId ? { beforeId } : {}) },
      }),
    }),
  }),
});

export const {
  useCreateSupportTicketMutation,
  useGetSupportTicketsQuery,
  useLazyGetTicketMessagesQuery,
} = supportsApi;
