import {
  SupportMessageAttachment,
  SupportMessageDto,
} from "@/api/types";

const TITLE_SEPARATOR = "\n\n";

export function buildInitialTicketContent(
  subject: string,
  message: string
): string {
  return `${subject.trim()}${TITLE_SEPARATOR}${message.trim()}`;
}

export function buildPendingInitialMessage(
  pending: { subject: string; message: string; imageUrl?: string },
  ticketId: number,
  senderId: number
): SupportMessageDto {
  return {
    id: -Date.now(),
    ticketId,
    senderId,
    senderType: "user",
    content: buildInitialTicketContent(pending.subject, pending.message),
    createdAt: new Date().toISOString(),
    editedAt: null,
    attachments: pending.imageUrl
      ? [{ url: pending.imageUrl, type: "image" }]
      : undefined,
  };
}

export function pendingMessageExistsInList(
  pending: { subject: string; message: string },
  messages: SupportMessageDto[]
): boolean {
  const expectedContent = buildInitialTicketContent(
    pending.subject,
    pending.message
  );
  const trimmedMessage = pending.message.trim();

  return messages
    .filter((message) => message.id > 0)
    .some(
      (message) =>
        message.senderType === "user" &&
        (message.content.trim() === expectedContent ||
          message.content.includes(trimmedMessage))
    );
}

export function parseMessageContent(content: string): {
  title: string | null;
  body: string;
} {
  const separatorIndex = content.indexOf(TITLE_SEPARATOR);
  if (separatorIndex === -1) {
    return { title: null, body: content };
  }

  const title = content.slice(0, separatorIndex).trim();
  const body = content.slice(separatorIndex + TITLE_SEPARATOR.length).trim();

  if (!title || !body) {
    return { title: null, body: content };
  }

  return { title, body };
}

function normalizeAttachments(raw: unknown): SupportMessageAttachment[] {
  if (!Array.isArray(raw)) return [];

  const attachments: SupportMessageAttachment[] = [];

  for (const item of raw) {
    if (typeof item === "string") {
      attachments.push({ url: item, type: "image" });
      continue;
    }

    if (typeof item !== "object" || item === null) continue;

    const record = item as Record<string, unknown>;
    const url = record.url ?? record.media_url ?? record.mediaUrl;
    if (!url) continue;

    attachments.push({
      url: String(url),
      type: (record.type as SupportMessageAttachment["type"]) ?? "image",
      name: record.name ? String(record.name) : undefined,
    });
  }

  return attachments;
}

export function normalizeSupportMessage(
  raw: Record<string, unknown>
): SupportMessageDto | null {
  const id = raw.id ?? raw.message_id;
  const content = raw.content;

  if (id == null || content == null) return null;

  const attachments = [
    ...normalizeAttachments(raw.attachments),
    ...normalizeAttachments(raw.media),
  ];

  const imageUrl = raw.image_url ?? raw.imageUrl ?? raw.screenshot_url ?? raw.screenshotUrl;
  if (imageUrl && !attachments.some((item) => item.url === String(imageUrl))) {
    attachments.push({ url: String(imageUrl), type: "image" });
  }

  return {
    id: Number(id),
    ticketId: Number(raw.ticketId ?? raw.ticket_id ?? 0),
    senderId: Number(raw.senderId ?? raw.sender_id ?? 0),
    senderType: String(raw.senderType ?? raw.sender_type ?? "user") as
      | "user"
      | "admin",
    content: String(content),
    createdAt: String(
      raw.createdAt ?? raw.created_at ?? new Date().toISOString()
    ),
    editedAt:
      raw.editedAt != null || raw.edited_at != null
        ? String(raw.editedAt ?? raw.edited_at)
        : null,
    attachments: attachments.length > 0 ? attachments : undefined,
  };
}

export function mergeSupportMessages(
  prev: SupportMessageDto[],
  incoming: SupportMessageDto
): SupportMessageDto[] {
  const withoutOptimistic = prev.filter(
    (m) =>
      !(
        m.id < 0 &&
        m.senderType === "user" &&
        incoming.senderType === "user" &&
        m.content.trim() === incoming.content.trim()
      )
  );

  const existingIndex = withoutOptimistic.findIndex((m) => m.id === incoming.id);
  if (existingIndex >= 0) {
    const next = [...withoutOptimistic];
    next[existingIndex] = {
      ...withoutOptimistic[existingIndex],
      ...incoming,
      attachments:
        incoming.attachments?.length
          ? incoming.attachments
          : withoutOptimistic[existingIndex].attachments,
    };
    return next;
  }

  return [...withoutOptimistic, incoming];
}
