import { useEffect, useMemo } from "react";
import { supportWs } from "../lib/supportSocket";

export function useSupportInboxJoin(ticketIds: number[]) {
  const joinedKey = useMemo(
    () =>
      [...new Set(ticketIds.filter((id) => id > 0 && !Number.isNaN(id)))].sort(
        (a, b) => a - b
      ).join(","),
    [ticketIds]
  );

  useEffect(() => {
    if (!joinedKey) return;

    const ids = joinedKey.split(",").map(Number);
    supportWs.joinTickets(ids);
  }, [joinedKey]);
}
