import { SupportMessageAttachment } from "@/api/types";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import AttachmentImage from "@/widgets/Support/components/MessageBubble/components/AttachmentImage";
import { createAttachmentStyles } from "@/widgets/Support/components/MessageBubble/components/attachmentStyles";
import React from "react";
import { View } from "react-native";

interface MessageAttachmentProps {
  attachment: SupportMessageAttachment;
}

const MessageAttachment = ({ attachment }: MessageAttachmentProps) => {
  const styles = useThemedStyles(createAttachmentStyles);

  return (
    <View style={styles.imageContainer}>
      <AttachmentImage
        attachment={attachment}
        style={styles.singleImageCell}
      />
    </View>
  );
};

export default MessageAttachment;
