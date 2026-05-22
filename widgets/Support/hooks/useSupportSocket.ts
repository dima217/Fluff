import { useAppSelector } from "@/api";
import { useEffect, useState } from "react";
import { supportWs, WsStatus } from "../lib/supportSocket";

export function useSupportSocket() {
  const [status, setStatus] = useState<WsStatus>(supportWs.status);
  const isAuthenticated = useAppSelector((s) => s.user.isAuthenticated);

  useEffect(() => {
    return supportWs.onStatus(setStatus);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      supportWs.connect();
    } else {
      supportWs.disconnect();
    }
  }, [isAuthenticated]);

  return status;
}
