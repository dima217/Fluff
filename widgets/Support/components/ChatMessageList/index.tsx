import { SupportMessageDto } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/ui/ThemedText";
import MessageBubble from "@/widgets/Support/components/MessageBubble";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
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

    const invertedMessages = useMemo(
      () => [...messages].reverse(),
      [messages]
    );

    const scrollToEnd = useCallback((animated = false) => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated });
    }, []);

    useImperativeHandle(ref, () => ({ scrollToEnd }), [scrollToEnd]);

    useEffect(() => {
      const event =
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const sub = Keyboard.addListener(event, () => {
        requestAnimationFrame(() => scrollToEnd(false));
      });
      return () => sub.remove();
    }, [scrollToEnd]);

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
        inverted 
        data={invertedMessages}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageBubble key={item.id} message={item} isOwn={item.senderType === "user"} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={styles.empty} type="xs">
            No messages yet. Send the first one!
          </ThemedText>
        }
        ListHeaderComponent={
          isAdminTyping ? (
            <ThemedText style={styles.typing} type="xs">
              Support is typing…
            </ThemedText>
          ) : null
        }
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
      paddingTop: 20,
      paddingBottom: 16,
      flexGrow: 1,
    },
    empty: {
      textAlign: "center",
      color: colors.secondary,
      transform: [{ scaleY: -1 }],
    },
    typing: {
      color: colors.secondary,
      paddingHorizontal: 20,
      paddingTop: 8,
      fontStyle: "italic",
      transform: [{ scaleY: -1 }],
    },
  });
