import { SupportMessageDto } from "@/api/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import MessageAttachments from "@/widgets/Support/components/MessageBubble/components/MessageAttachments";
import { formatMessageDate } from "@/widgets/Support/components/MessageBubble/lib/formatMessageDate";
import { createMessageBubbleStyles } from "@/widgets/Support/components/MessageBubble/styles";
import { parseMessageContent } from "@/widgets/Support/lib/supportMessages";
import React from "react";
import { View } from "react-native";

interface MessageBubbleProps {
  message: SupportMessageDto;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const colors = useColors();
  const styles = useThemedStyles(createMessageBubbleStyles);
  const { title, body } = parseMessageContent(message.content);
  const attachments = message.attachments ?? [];
  const textColor = isOwn ? colors.onPrimary : colors.text;

  const content = (
    <View>
      <View style={styles.contentWrapper}>
        {title ? (
          <ThemedText
            style={[
              styles.title,
              { color: textColor },
            ]}
          >
            {title}
          </ThemedText>
        ) : null}

        {body ? (
          <ThemedText
            style={[
              styles.content,
              { color: textColor },
              title ? styles.contentWithTitle : undefined,
            ]}
          >
            {body}
          </ThemedText>
        ) : null}
      </View>

      <MessageAttachments attachments={attachments} />
    </View>
  );

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      {isOwn ? (
        <View
          style={[
            styles.bubble,
            styles.bubbleOwn,
            { backgroundColor: colors.primary },
          ]}
        >
          {content}
        </View>
      ) : (
        <GradientView style={[styles.bubble, styles.bubbleOther]}>
          {content}
        </GradientView>
      )}
      <ThemedText style={[styles.time, { alignSelf: isOwn ? "flex-end" : "flex-start" }]}>
        {formatMessageDate(message.createdAt)}
      </ThemedText>
    </View>
  );
};

export default MessageBubble;
