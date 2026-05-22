import { Ticket } from "@/api/types";

function toBool(value: unknown): boolean {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  return false;
}

export function normalizeTicket(raw: Record<string, unknown>): Ticket {
  return {
    id: Number(raw.id),
    userId: Number(raw.userId ?? raw.user_id ?? 0),
    subject: String(raw.subject ?? ""),
    message: String(raw.message ?? ""),
    status: String(raw.status ?? "open") as Ticket["status"],
    adminResponse:
      raw.adminResponse != null || raw.admin_response != null
        ? String(raw.adminResponse ?? raw.admin_response)
        : null,
    createdAt: (raw.createdAt ?? raw.created_at ?? new Date().toISOString()) as Date,
    updatedAt: (raw.updatedAt ?? raw.updated_at ?? new Date().toISOString()) as Date,
    adminSeen: toBool(raw.adminSeen ?? raw.admin_seen),
    hasUnreadAdminMessage: toBool(
      raw.hasUnreadAdminMessage ?? raw.has_unread_admin_message
    ),
  };
}

export function parseTicketEvent(data: Record<string, unknown>) {
  return {
    ticketId: Number(data.ticketId ?? data.ticket_id ?? 0),
    userId: Number(data.userId ?? data.user_id ?? 0),
    status: data.status != null ? String(data.status) : undefined,
    adminSeen: data.adminSeen ?? data.admin_seen,
    hasUnreadAdminMessage:
      data.hasUnreadAdminMessage ?? data.has_unread_admin_message,
    isAdmin: toBool(data.isAdmin ?? data.is_admin),
  };
}

export function normalizeTicketsResponse(response: unknown): Ticket[] {
  const list = Array.isArray(response)
    ? response
    : (response as { tickets?: unknown[] })?.tickets ?? [];

  if (!Array.isArray(list)) return [];

  return list
    .map((item) =>
      normalizeTicket(
        typeof item === "object" && item !== null
          ? (item as Record<string, unknown>)
          : {}
      )
    )
    .filter((ticket) => ticket.id > 0);
}
