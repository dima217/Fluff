import { useAppSelector } from "@/api";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import ChatInput from "@/widgets/Support/components/ChatInput";
import ChatMessageList, {
  ChatMessageListRef,
} from "@/widgets/Support/components/ChatMessageList";
import { useSupportChat } from "@/widgets/Support/hooks/useSupportChat";
import { SupportTicketStatus } from "@/api/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

export default function SupportChatScreen() {
  const { ticketId, subject, status } = useLocalSearchParams<{
    ticketId: string;
    subject: string;
    status?: SupportTicketStatus;
  }>();

  const styles = useThemedStyles(createStyles);
  const messageListRef = useRef<ChatMessageListRef>(null);

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
      setTimeout(() => messageListRef.current?.scrollToEnd(true), 100);
      return true;
    },
    [sendMessage, currentUserId]
  );

  return (
    <View style={styles.screen}>
        <Header title={subject ?? "Support Chat"} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={styles.flex}
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
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      paddingBottom: 20,
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
