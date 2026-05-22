import { AppDispatch } from "@/api/store";
import { Ticket } from "@/api/types";
import { supportsApi } from "@/api/slices/supportsApi";

const DEFAULT_LIST_ARGS = { page: 1, limit: 20 };

export function patchSupportTicketInCache(
  dispatch: AppDispatch,
  ticketId: number,
  patch: Partial<Ticket>
) {
  dispatch(
    supportsApi.util.updateQueryData(
      "getSupportTickets",
      DEFAULT_LIST_ARGS,
      (draft) => {
        const ticket = draft.data.find((item) => item.id === ticketId);
        if (ticket) {
          Object.assign(ticket, patch);
        }
      }
    )
  );
}

export function invalidateSupportTickets(dispatch: AppDispatch) {
  dispatch(supportsApi.util.invalidateTags(["SupportTicket"]));
}
