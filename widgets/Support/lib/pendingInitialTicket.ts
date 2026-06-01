export interface PendingInitialTicket {
  ticketId: number;
  subject: string;
  message: string;
  imageUrl?: string;
}

let pendingInitialTicket: PendingInitialTicket | null = null;

export function setPendingInitialTicket(data: PendingInitialTicket) {
  pendingInitialTicket = data;
}

export function peekPendingInitialTicket(
  ticketId: number
): PendingInitialTicket | null {
  if (pendingInitialTicket?.ticketId !== ticketId) return null;
  return pendingInitialTicket;
}

export function consumePendingInitialTicket(
  ticketId: number
): PendingInitialTicket | null {
  if (pendingInitialTicket?.ticketId !== ticketId) return null;
  const data = pendingInitialTicket;
  pendingInitialTicket = null;
  return data;
}

export function clearPendingInitialTicket(ticketId?: number) {
  if (ticketId == null || pendingInitialTicket?.ticketId === ticketId) {
    pendingInitialTicket = null;
  }
}
