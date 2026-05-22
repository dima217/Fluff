import { useAppDispatch } from "@/api/hooks";
import { Ticket } from "@/api/types";
import { useEffect } from "react";
import { normalizeSupportMessage } from "../lib/supportMessages";
import { supportWs } from "../lib/supportSocket";
import {
  invalidateSupportTickets,
  patchSupportTicketInCache,
} from "../lib/supportTicketCache";
import { parseTicketEvent } from "../lib/supportTickets";

interface Options {
  currentUserId: number;
  onReplied?: (ticketId: number) => void;
  onStatusUpdated?: (ticketId: number, status: string) => void;
  onCreated?: (ticketId: number) => void;
}

function belongsToUser(userId: number, currentUserId: number) {
  if (!userId) return true;
  if (!currentUserId) return false;
  return Number(userId) === Number(currentUserId);
}

function applyTicketPatch(
  dispatch: ReturnType<typeof useAppDispatch>,
  ticketId: number,
  patch: Partial<Ticket>
) {
  if (!ticketId) return;
  patchSupportTicketInCache(dispatch, ticketId, patch);
}

export function useSupportTicketEvents({
  currentUserId,
  onReplied,
  onStatusUpdated,
  onCreated,
}: Options) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const offReplied = supportWs.on("support:ticket_replied", (data) => {
      const { ticketId, userId } = parseTicketEvent(data);
      if (!belongsToUser(userId, currentUserId)) return;

      applyTicketPatch(dispatch, ticketId, { hasUnreadAdminMessage: true });
      invalidateSupportTickets(dispatch);
      onReplied?.(ticketId);
    });

    const offStatus = supportWs.on("support:ticket_status_updated", (data) => {
      const { ticketId, userId, status } = parseTicketEvent(data);
      if (!belongsToUser(userId, currentUserId) || !status) return;

      applyTicketPatch(dispatch, ticketId, {
        status: status as Ticket["status"],
      });
      invalidateSupportTickets(dispatch);
      onStatusUpdated?.(ticketId, status);
    });

    const offCreated = supportWs.on("support:ticket_created", (data) => {
      const { ticketId, userId } = parseTicketEvent(data);
      if (!belongsToUser(userId, currentUserId)) return;

      invalidateSupportTickets(dispatch);
      onCreated?.(ticketId);
    });

    const offRead = supportWs.on("support.read", (data) => {
      const event = parseTicketEvent(data);
      if (event.userId && !belongsToUser(event.userId, currentUserId)) return;

      const patch: Partial<Ticket> = {};

      if (event.isAdmin || event.adminSeen === true) {
        patch.adminSeen = true;
      }

      if (event.hasUnreadAdminMessage === false) {
        patch.hasUnreadAdminMessage = false;
      }

      if (Object.keys(patch).length > 0 && event.ticketId) {
        applyTicketPatch(dispatch, event.ticketId, patch);
      }

      invalidateSupportTickets(dispatch);
    });

    const offMessage = supportWs.on("support.message", (data) => {
      const message = normalizeSupportMessage(data);
      if (!message || message.senderType !== "admin" || !message.ticketId) {
        return;
      }

      applyTicketPatch(dispatch, message.ticketId, {
        hasUnreadAdminMessage: true,
      });
      invalidateSupportTickets(dispatch);
      onReplied?.(message.ticketId);
    });

    return () => {
      offReplied();
      offStatus();
      offCreated();
      offRead();
      offMessage();
    };
  }, [currentUserId, dispatch, onCreated, onReplied, onStatusUpdated]);
}
