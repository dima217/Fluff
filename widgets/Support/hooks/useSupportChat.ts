import { useAppDispatch, useAppSelector, useGetSupportTicketsQuery, useLazyGetTicketMessagesQuery } from "@/api";
import { SupportMessageAttachment, SupportMessageDto, SupportTicketStatus } from "@/api/types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildInitialTicketContent,
  mergeSupportMessages,
  normalizeSupportMessage,
} from "../lib/supportMessages";
import {
  clearPendingInitialTicket,
  consumePendingInitialTicket,
} from "../lib/pendingInitialTicket";
import { patchSupportTicketInCache } from "../lib/supportTicketCache";
import { parseTicketEvent } from "../lib/supportTickets";
import { supportWs } from "../lib/supportSocket";
import { useSupportImageUpload } from "./useSupportImageUpload";

function parseMessagesResponse(res: unknown): SupportMessageDto[] {
  const list = Array.isArray(res)
    ? res
    : (res as { messages?: unknown[]; data?: unknown[] })?.messages ??
      (res as { data?: unknown[] })?.data ??
      [];

  if (!Array.isArray(list)) return [];

  return list
    .map((item) =>
      normalizeSupportMessage(item as Record<string, unknown>)
    )
    .filter((item): item is SupportMessageDto => item !== null);
}

export function useSupportChat(ticketId: number, initialStatus?: SupportTicketStatus) {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<SupportMessageDto[]>([]);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<SupportTicketStatus>(
    initialStatus ?? "open"
  );

  const { data: ticketsResponse } = useGetSupportTicketsQuery({
    page: 1,
    limit: 50,
  });
  const cachedTicket = ticketsResponse?.data.find((ticket) => ticket.id === ticketId);
  const isTicketClosed = ticketStatus === "closed";
  const ticketClosedRef = useRef(isTicketClosed);
  ticketClosedRef.current = isTicketClosed;

  useEffect(() => {
    if (cachedTicket?.status) {
      setTicketStatus(cachedTicket.status);
    }
  }, [cachedTicket?.status]);

  const profile = useAppSelector((s) => s.user.profile);
  const currentUserId = profile?.user?.id ? Number(profile.user.id) : 0;

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRequestsRef = useRef<Map<string, number>>(new Map());
  const initialTicketSentRef = useRef(false);
  const [fetchMessages] = useLazyGetTicketMessagesQuery();
  const fetchMessagesRef = useRef(fetchMessages);
  fetchMessagesRef.current = fetchMessages;
  const { uploadImages, isUploading } = useSupportImageUpload();

  const postMessage = useCallback(
    (
      content: string,
      senderId: number,
      attachments?: SupportMessageAttachment[]
    ) => {
      const trimmed = content.trim();
      const hasAttachments = Boolean(attachments?.length);
      if (
        ticketClosedRef.current ||
        (!trimmed && !hasAttachments) ||
        !ticketId ||
        Number.isNaN(ticketId)
      ) {
        return;
      }

      const clientRequestId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const tempId = -Date.now();

      pendingRequestsRef.current.set(clientRequestId, tempId);

      const optimistic: SupportMessageDto = {
        id: tempId,
        ticketId,
        senderId,
        senderType: "user",
        content: trimmed || "",
        createdAt: new Date().toISOString(),
        editedAt: null,
        attachments,
      };

      setMessages((prev) => [...prev, optimistic]);

      supportWs.send("support.send", {
        ticket_id: ticketId,
        content: trimmed || "",
        client_request_id: clientRequestId,
        ...(attachments?.length ? { attachments } : {}),
      });
    },
    [ticketId]
  );

  useEffect(() => {
    if (!ticketId || Number.isNaN(ticketId)) return;

    initialTicketSentRef.current = false;
    let cancelled = false;
    setMessages([]);
    setIsLoadingMessages(true);

    fetchMessagesRef.current({ ticketId })
      .unwrap()
      .then((res) => {
        if (cancelled) return;
        const parsed = parseMessagesResponse(res);
        if (parsed.length > 0) {
          clearPendingInitialTicket(ticketId);
        }
        setMessages(parsed);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMessages(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  useEffect(() => {
    if (
      isLoadingMessages ||
      isTicketClosed ||
      !ticketId ||
      Number.isNaN(ticketId) ||
      initialTicketSentRef.current ||
      messages.length > 0 ||
      !currentUserId
    ) {
      return;
    }

    const pending = consumePendingInitialTicket(ticketId);
    if (!pending) return;

    initialTicketSentRef.current = true;

    const content = buildInitialTicketContent(pending.subject, pending.message);
    const attachments = pending.imageUrl
      ? [{ url: pending.imageUrl, type: "image" as const }]
      : undefined;

    postMessage(content, currentUserId, attachments);
  }, [
    currentUserId,
    isLoadingMessages,
    messages.length,
    postMessage,
    ticketId,
    isTicketClosed,
  ]);

  useEffect(() => {
    if (!ticketId || Number.isNaN(ticketId)) return;

    supportWs.joinTicket(ticketId);
    supportWs.send("support.read", { ticket_id: ticketId });
    patchSupportTicketInCache(dispatch, ticketId, {
      hasUnreadAdminMessage: false,
    });

    const offStatus = supportWs.on("support:ticket_status_updated", (data) => {
      const { ticketId: eventTicketId, status } = parseTicketEvent(data);
      if (eventTicketId !== ticketId || !status) return;

      const nextStatus = status as SupportTicketStatus;
      setTicketStatus(nextStatus);
      patchSupportTicketInCache(dispatch, ticketId, { status: nextStatus });
    });

    const offMessage = supportWs.on("support.message", (data) => {
      const msg = normalizeSupportMessage(data);
      if (!msg || (msg.ticketId && msg.ticketId !== ticketId)) return;

      setMessages((prev) => mergeSupportMessages(prev, msg));

      if (msg.senderType === "admin") {
        supportWs.send("support.read", { ticket_id: ticketId });
        patchSupportTicketInCache(dispatch, ticketId, {
          hasUnreadAdminMessage: false,
        });
      }
    });

    const offRead = supportWs.on("support.read", (data) => {
      const readTicketId = Number(data.ticket_id ?? data.ticketId);
      if (readTicketId !== ticketId) return;

      const isAdmin = Boolean(data.is_admin ?? data.isAdmin);
      if (isAdmin || data.admin_seen === true || data.adminSeen === true) {
        patchSupportTicketInCache(dispatch, ticketId, { adminSeen: true });
      }
    });

    const offEdit = supportWs.on("support.edit", (data) => {
      const messageId = Number(data.message_id ?? data.messageId);
      const content = data.content;
      const editedAt = data.edited_at ?? data.editedAt;

      if (!messageId || content == null) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                content: String(content),
                editedAt: editedAt ? String(editedAt) : m.editedAt,
              }
            : m
        )
      );
    });

    const offTyping = supportWs.on("support.typing", (data) => {
      const ticket_id = Number(data.ticket_id ?? data.ticketId);
      if (ticket_id && ticket_id !== ticketId) return;

      const isAdmin = Boolean(data.is_admin ?? data.isAdmin);
      const isTyping = Boolean(data.is_typing ?? data.isTyping);
      if (!isAdmin) return;

      setIsAdminTyping(isTyping);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      if (isTyping) {
        typingTimerRef.current = setTimeout(() => setIsAdminTyping(false), 3000);
      }
    });

    const offAck = supportWs.on("support.send.ack", (data) => {
      const clientRequestId = String(
        data.client_request_id ?? data.clientRequestId ?? ""
      );
      const messageId = Number(data.message_id ?? data.messageId);
      const createdAt = String(data.created_at ?? data.createdAt ?? "");

      if (!clientRequestId || !messageId) return;

      const tempId = pendingRequestsRef.current.get(clientRequestId);
      if (tempId === undefined) return;

      pendingRequestsRef.current.delete(clientRequestId);
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        const existing = withoutTemp.find((m) => m.id === messageId);
        if (existing) return withoutTemp;

        const optimistic = prev.find((m) => m.id === tempId);
        if (!optimistic) return withoutTemp;

        return mergeSupportMessages(withoutTemp, {
          ...optimistic,
          id: messageId,
          createdAt: createdAt || optimistic.createdAt,
        });
      });
    });

    return () => {
      offMessage();
      offRead();
      offStatus();
      offEdit();
      offTyping();
      offAck();
      pendingRequestsRef.current.clear();
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [dispatch, ticketId]);

  const sendMessage = useCallback(
    async (content: string, senderId: number, imageUris?: string[]) => {
      if (ticketClosedRef.current) return false;

      let attachments: SupportMessageAttachment[] | undefined;

      if (imageUris?.length) {
        try {
          attachments = await uploadImages(imageUris);
        } catch {
          return false;
        }
      }

      postMessage(content, senderId, attachments);
      return true;
    },
    [postMessage, uploadImages]
  );

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      if (ticketClosedRef.current || !ticketId || Number.isNaN(ticketId)) return;
      supportWs.send("support.typing", {
        ticket_id: ticketId,
        is_typing: isTyping,
      });
    },
    [ticketId]
  );

  return {
    messages,
    isAdminTyping,
    isLoadingMessages,
    isUploading,
    isTicketClosed,
    ticketStatus,
    sendMessage,
    notifyTyping,
  };
}
