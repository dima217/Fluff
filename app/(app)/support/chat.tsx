import { useAppSelector } from "@/api";
import { SupportTicketStatus } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import { ThemedText } from "@/shared/ui/ThemedText";
import ErrorModal from "@/shared/Modals/ErrorModal";
import View from "@/shared/View";
import ChatInput from "@/widgets/Support/components/ChatInput";
import ChatMessageList, {
  ChatMessageListRef,
} from "@/widgets/Support/components/ChatMessageList";
import { useSupportChat } from "@/widgets/Support/hooks/useSupportChat";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet } from "react-native";

export default function SupportChatScreen() {
  const { t } = useTranslation();
  const { ticketId, subject, status } = useLocalSearchParams<{
    ticketId: string;
    subject: string;
    status?: SupportTicketStatus;
  }>();

  const styles = useThemedStyles(createStyles);
  const messageListRef = useRef<ChatMessageListRef>(null);
  const [uploadErrorVisible, setUploadErrorVisible] = useState(false);

  const profile = useAppSelector((s) => s.user.profile);
  const currentUserId = profile?.user?.id ? Number(profile.user.id) : 0;

  const { messages, isAdminTyping, isLoadingMessages, isUploading, isTicketClosed, sendMessage, notifyTyping } =
    useSupportChat(Number(ticketId), status);

  const handleSend = useCallback(
    async (text: string, imageUris?: string[]) => {
      const sent = await sendMessage(text, currentUserId, imageUris);
      if (sent === false) {
        setUploadErrorVisible(true);
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

      <KeyboardAwareView style={styles.flex}>
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
      </KeyboardAwareView>
      <ErrorModal
        isVisible={uploadErrorVisible}
        message={t("support.uploadError")}
        onClose={() => setUploadErrorVisible(false)}
      />
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
