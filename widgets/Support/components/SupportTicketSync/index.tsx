import { useAppSelector, useGetSupportTicketsQuery } from "@/api";
import { useSupportInboxJoin } from "@/widgets/Support/hooks/useSupportInboxJoin";
import { useSupportSocket } from "@/widgets/Support/hooks/useSupportSocket";
import { useSupportTicketEvents } from "@/widgets/Support/hooks/useSupportTicketEvents";
import { useMemo } from "react";

const INBOX_LIMIT = 50;

export function SupportTicketSync() {
  const isAuthenticated = useAppSelector((s) => s.user.isAuthenticated);
  const profile = useAppSelector((s) => s.user.profile);
  const currentUserId = profile?.user?.id ? Number(profile.user.id) : 0;

  useSupportSocket();

  const { data: ticketsResponse } = useGetSupportTicketsQuery(
    { page: 1, limit: INBOX_LIMIT },
    { skip: !isAuthenticated }
  );

  const ticketIds = useMemo(
    () => (ticketsResponse?.data ?? []).map((ticket) => ticket.id),
    [ticketsResponse?.data]
  );

  useSupportInboxJoin(ticketIds);
  useSupportTicketEvents({ currentUserId });

  return null;
}

export default SupportTicketSync;
