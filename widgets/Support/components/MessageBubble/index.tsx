import { useMediaUrl } from "@/api";
import { SupportMessageAttachment, SupportMessageDto } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import ImageFullscreenViewer from "@/widgets/Support/components/ImageFullscreenViewer";
import { parseMessageContent } from "@/widgets/Support/lib/supportMessages";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface MessageBubbleProps {
  message: SupportMessageDto;
  isOwn: boolean;
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

const MessageAttachment = ({
  attachment,
  isOwn,
}: {
  attachment: SupportMessageAttachment;
  isOwn: boolean;
}) => {
  const styles = useThemedStyles(createStyles);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { url: mediaUrl, headers } = useMediaUrl(attachment.url, {
    skip: !attachment.url,
  });

  if (!mediaUrl) return null;

  return (
    <>
      <Pressable onPress={() => setIsFullscreen(true)}>
        <Image
          source={headers ? { uri: mediaUrl, headers } : { uri: mediaUrl }}
          style={[styles.image, isOwn && styles.imageOwn]}
          contentFit="cover"
          transition={200}
        />
      </Pressable>

      <ImageFullscreenViewer
        visible={isFullscreen}
        uri={mediaUrl}
        headers={headers}
        onClose={() => setIsFullscreen(false)}
      />
    </>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { title, body } = parseMessageContent(message.content);
  const attachments = message.attachments ?? [];

  const content = (
    <>
      {title ? (
        <ThemedText
          style={[
            styles.title,
            isOwn ? { color: colors.onPrimary } : undefined,
          ]}
        >
          {title}
        </ThemedText>
      ) : null}

      {body ? (
        <ThemedText
          style={[
            styles.content,
            isOwn ? { color: colors.onPrimary } : undefined,
            title ? styles.contentWithTitle : undefined,
          ]}
        >
          {body}
        </ThemedText>
      ) : null}

      {attachments.map((attachment, index) => (
        <MessageAttachment
          key={`${attachment.url}-${index}`}
          attachment={attachment}
          isOwn={isOwn}
        />
      ))}

      <ThemedText style={[styles.time, { color: isOwn ? `${colors.onPrimary}99` : colors.secondary }]}>
        {formatTime(message.createdAt)}
        {message.editedAt ? "  ·  edited" : ""}
      </ThemedText>
    </>
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
    </View>
  );
};

export default MessageBubble;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    rowOwn: {
      alignItems: "flex-end",
    },
    rowOther: {
      alignItems: "flex-start",
    },
    bubble: {
      maxWidth: "78%",
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    bubbleOwn: {
      borderBottomRightRadius: 4,
    },
    bubbleOther: {
      flex: 0,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      lineHeight: 22,
    },
    content: {
      fontSize: 15,
      lineHeight: 21,
    },
    contentWithTitle: {
      marginTop: 6,
    },
    image: {
      width: 220,
      height: 160,
      borderRadius: 12,
      marginTop: 10,
      backgroundColor: colors.overlaySubtle,
    },
    imageOwn: {
      alignSelf: "flex-end",
    },
    time: {
      fontSize: 11,
      marginTop: 8,
      alignSelf: "flex-end",
    },
  });
