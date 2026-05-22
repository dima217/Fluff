import { SupportMessageAttachment } from "@/api/types";
import MessageAttachment from "@/widgets/Support/components/MessageBubble/components/MessageAttachment";
import MessageAttachmentsAlbum from "@/widgets/Support/components/MessageBubble/components/MessageAttachmentsAlbum";

interface MessageAttachmentsProps {
  attachments: SupportMessageAttachment[];
}

const MessageAttachments = ({ attachments }: MessageAttachmentsProps) => {
  const imageAttachments = attachments.filter(
    (attachment) => attachment.type !== "file"
  );

  if (imageAttachments.length === 0) return null;

  if (imageAttachments.length === 1) {
    return <MessageAttachment attachment={imageAttachments[0]} />;
  }

  return <MessageAttachmentsAlbum attachments={imageAttachments} />;
};

export default MessageAttachments;
