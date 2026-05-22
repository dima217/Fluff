import { SupportMessageDto } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/ui/ThemedText";
import MessageBubble from "@/widgets/Support/components/MessageBubble";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";

export interface ChatMessageListRef {
  scrollToEnd: (animated?: boolean) => void;
}

interface ChatMessageListProps {
  messages: SupportMessageDto[];
  isLoading: boolean;
  isAdminTyping: boolean;
}

const ChatMessageList = forwardRef<ChatMessageListRef, ChatMessageListProps>(
  ({ messages, isLoading, isAdminTyping }, ref) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const flatListRef = useRef<FlatList<SupportMessageDto>>(null);

    const scrollToEnd = (animated = false) => {
      flatListRef.current?.scrollToEnd({ animated });
    };

    useImperativeHandle(ref, () => ({ scrollToEnd }), []);

    useEffect(() => {
      if (messages.length > 0) {
        scrollToEnd(false);
      }
    }, [messages.length]);

    useEffect(() => {
      const event =
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const sub = Keyboard.addListener(event, () => {
        requestAnimationFrame(() => scrollToEnd(true));
        setTimeout(() => scrollToEnd(true), 100);
      });
      return () => sub.remove();
    }, []);

    if (isLoading) {
      return (
        <ActivityIndicator
          style={styles.loader}
          color={colors.primary}
          size="large"
        />
      );
    }

    return (
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwn={item.senderType === "user"} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={styles.empty} type="xs">
            No messages yet. Send the first one!
          </ThemedText>
        }
        ListFooterComponent={
          isAdminTyping ? (
            <ThemedText style={styles.typing} type="xs">
              Support is typing…
            </ThemedText>
          ) : null
        }
        onContentSizeChange={() => scrollToEnd(false)}
      />
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";

export default ChatMessageList;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    loader: {
      flex: 1,
    },
    listContent: {
      paddingTop: 16,
      paddingBottom: 20,
      flexGrow: 1,
    },
    empty: {
      textAlign: "center",
      color: colors.secondary,
      marginTop: 60,
    },
    typing: {
      color: colors.secondary,
      paddingHorizontal: 20,
      paddingBottom: 8,
      fontStyle: "italic",
    },
  });
