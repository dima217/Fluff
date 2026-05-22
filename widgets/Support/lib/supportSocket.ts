import { getBaseUrl } from "@/api/config";
import { tokenStorage } from "@/api/utils/tokenStorage";
import { io, Socket } from "socket.io-client";

export type WsStatus = "disconnected" | "connecting" | "connected";

type Listener = (data: Record<string, unknown>) => void;

const MAX_PENDING_SENDS = 30;

const SUPPORT_EVENTS = [
  "support.message",
  "support.edit",
  "support.typing",
  "support.read",
  "support.send.ack",
  "support.error",
  "support:ticket_status_updated",
  "support:ticket_replied",
  "support:ticket_created",
] as const;

class SupportSocket {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private statusListeners = new Set<(status: WsStatus) => void>();
  private _status: WsStatus = "disconnected";
  private connectAttemptInFlight = false;
  private pendingSends: Array<{ event: string; data: Record<string, unknown> }> = [];
  private joinedTicketIds = new Set<number>();

  get status() {
    return this._status;
  }

  get joinedTickets(): number[] {
    return [...this.joinedTicketIds];
  }

  private setStatus(s: WsStatus) {
    this._status = s;
    this.statusListeners.forEach((fn) => fn(s));
  }

  private flushPendingJoins() {
    if (!this.socket?.connected || this.joinedTicketIds.size === 0) return;

    for (const ticketId of this.joinedTicketIds) {
      this.socket.emit("support.join", { ticket_id: ticketId });
    }
  }

  /** @deprecated kept for stale hot-reload listeners */
  private flushPendingJoin = () => {
    this.flushPendingJoins();
  };

  private handleConnect = () => {
    this.connectAttemptInFlight = false;
    this.setStatus("connected");
    this.flushPendingJoins();
    queueMicrotask(() => this.flushPendingSends());
  };

  private handleDisconnect = () => {
    this.setStatus("disconnected");
  };

  private handleConnectError = () => {
    this.connectAttemptInFlight = false;
    this.setStatus("disconnected");
  };

  private flushPendingSends() {
    if (!this.socket?.connected || this.pendingSends.length === 0) return;
    const batch = this.pendingSends.splice(0);
    for (const { event, data } of batch) {
      this.socket.emit(event, data);
    }
  }

  async connect() {
    if (this.socket?.connected) {
      this.flushPendingJoins();
      return;
    }
    if (this.connectAttemptInFlight) return;

    this.setStatus("connecting");
    this.connectAttemptInFlight = true;

    const token = await tokenStorage.getAccessToken();
    if (!token) {
      this.connectAttemptInFlight = false;
      this.setStatus("disconnected");
      return;
    }

    try {
      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      }

      this.socket = io(getBaseUrl(), {
        auth: { token: `Bearer ${token}` },
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 30000,
        reconnectionAttempts: Infinity,
      });

      this.socket.on("connect", this.handleConnect);
      this.socket.on("disconnect", this.handleDisconnect);
      this.socket.on("connect_error", this.handleConnectError);

      for (const event of SUPPORT_EVENTS) {
        this.socket.on(event, (payload: Record<string, unknown>) => {
          const data =
            typeof payload === "object" && payload !== null
              ? { ...payload, type: event }
              : { type: event };
          this.listeners.get(event)?.forEach((fn) => fn(data));
          this.listeners.get("*")?.forEach((fn) => fn(data));
        });
      }
    } catch {
      this.connectAttemptInFlight = false;
      this.setStatus("disconnected");
    }
  }

  disconnect() {
    this.connectAttemptInFlight = false;
    this.pendingSends = [];
    this.joinedTicketIds.clear();
    this.socket?.disconnect();
    this.socket?.removeAllListeners();
    this.socket = null;
    this.setStatus("disconnected");
  }

  joinTicket(ticketId: number) {
    if (!ticketId || Number.isNaN(ticketId)) return;
    this.joinedTicketIds.add(ticketId);
    this.flushPendingJoins();
  }

  joinTickets(ticketIds: number[]) {
    let changed = false;

    for (const ticketId of ticketIds) {
      if (!ticketId || Number.isNaN(ticketId)) continue;
      if (!this.joinedTicketIds.has(ticketId)) {
        this.joinedTicketIds.add(ticketId);
        changed = true;
      }
    }

    if (changed || this.socket?.connected) {
      this.flushPendingJoins();
    }
  }

  leaveTicket(ticketId: number) {
    if (!ticketId || Number.isNaN(ticketId)) return;
    if (!this.joinedTicketIds.delete(ticketId)) return;
    this.socket?.emit("support.leave", { ticket_id: ticketId });
  }

  send(event: string, data: Record<string, unknown>) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      return true;
    }
    if (this.pendingSends.length < MAX_PENDING_SENDS) {
      this.pendingSends.push({ event, data });
    }
    return false;
  }

  on(type: string, fn: Listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(fn);
    return () => {
      this.listeners.get(type)?.delete(fn);
    };
  }

  onStatus(fn: (status: WsStatus) => void) {
    this.statusListeners.add(fn);
    return () => {
      this.statusListeners.delete(fn);
    };
  }
}

export const supportWs = new SupportSocket();
