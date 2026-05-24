import { useAppSelector } from "@/api";
import { SupportTicketStatus } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import ChatInput from "@/widgets/Support/components/ChatInput";
import ChatMessageList, {
  ChatMessageListRef,
} from "@/widgets/Support/components/ChatMessageList";
import { useAnimatedKeyboard } from "@/widgets/Support/hooks/useAnimatedKeyboard";
import { useSupportChat } from "@/widgets/Support/hooks/useSupportChat";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef } from "react";
import { Alert, Animated, StyleSheet } from "react-native";

export default function SupportChatScreen() {
  const { t } = useTranslation();
  const { ticketId, subject, status } = useLocalSearchParams<{
    ticketId: string;
    subject: string;
    status?: SupportTicketStatus;
  }>();

  const styles = useThemedStyles(createStyles);
  const messageListRef = useRef<ChatMessageListRef>(null);
  const keyboardHeight = useAnimatedKeyboard();

  const profile = useAppSelector((s) => s.user.profile);
  const currentUserId = profile?.user?.id ? Number(profile.user.id) : 0;

  const { messages, isAdminTyping, isLoadingMessages, isUploading, isTicketClosed, sendMessage, notifyTyping } =
    useSupportChat(Number(ticketId), status);

  const handleSend = useCallback(
    async (text: string, imageUris?: string[]) => {
      const sent = await sendMessage(text, currentUserId, imageUris);
      if (sent === false) {
        Alert.alert("Error", "Failed to upload photos. Please try again.");
        return false;
      }
      setTimeout(() => messageListRef.current?.scrollToEnd(false), 100);
      return true;
    },
    [sendMessage, currentUserId]
  );

  return (
    <View style={styles.screen}>
      <Header title={subject ?? t("support.chatTitle")} />

      <Animated.View
        style={[styles.flex, { paddingBottom: keyboardHeight }]}
      >
        <ChatMessageList
          ref={messageListRef}
          messages={messages ?? []}
          isLoading={isLoadingMessages}
          isAdminTyping={isAdminTyping}
        />

        {isTicketClosed ? (
          <ThemedText style={styles.closedNotice} type="xs">
            This request has been closed by support. You can no longer send messages.
          </ThemedText>
        ) : (
          <ChatInput
            onSend={handleSend}
            onTypingChange={notifyTyping}
            isSending={isUploading}
          />
        )}
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    closedNotice: {
      textAlign: "center",
      color: colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
