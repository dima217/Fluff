import { useAppDispatch, useGetSupportTicketsQuery } from "@/api";
import { Ticket } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import usePagination from "@/hooks/usePagination";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Button from "@/shared/Buttons/Button";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import SupportCard from "@/widgets/Support/components/SupportCard";
import { patchSupportTicketInCache } from "@/widgets/Support/lib/supportTicketCache";
import { useSupportInboxJoin } from "@/widgets/Support/hooks/useSupportInboxJoin";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

const LIMIT = 20;

export default function Support() {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [canTriggerLoadMore, setCanTriggerLoadMore] = useState(true);

  const {
    accumulatedData: tickets,
    isLoading,
    isFetching,
    isLoadingMore,
    handleLoadMore,
    refetch,
  } = usePagination({
    limit: LIMIT,
    queryHook: useGetSupportTicketsQuery,
    queryArgs: { limit: LIMIT },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useSupportInboxJoin((tickets as Ticket[]).map((ticket) => ticket.id));

  const handleCardPress = useCallback(
    (ticket: Ticket) => {
      patchSupportTicketInCache(dispatch, ticket.id, {
        hasUnreadAdminMessage: false,
      });

      router.push({
        pathname: "/(app)/support/chat",
        params: { ticketId: String(ticket.id), subject: ticket.subject },
      });
    },
    [dispatch, router]
  );

  const handleScroll = useCallback(
    (event: {
      nativeEvent: {
        contentOffset: { y: number };
        layoutMeasurement: { height: number };
        contentSize: { height: number };
      };
    }) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      const viewportBottom = contentOffset.y + layoutMeasurement.height;
      const threshold = 120;
      const reachedBottom = viewportBottom >= contentSize.height - threshold;

      if (reachedBottom && canTriggerLoadMore) {
        setCanTriggerLoadMore(false);
        handleLoadMore();
      }

      if (!reachedBottom && !canTriggerLoadMore) {
        setCanTriggerLoadMore(true);
      }
    },
    [canTriggerLoadMore, handleLoadMore]
  );

  return (
    <View>
      <Header title="Support" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Button
          style={styles.reportButton}
          title="Report a Problem"
          onPress={() => router.push("/(app)/support/create")}
        />

        {isLoading && tickets.length === 0 ? (
          <ActivityIndicator
            style={styles.loader}
            color={colors.primary}
            size="large"
          />
        ) : tickets.length > 0 ? (
          <>
            {(tickets as Ticket[]).map((ticket) => (
              <SupportCard
                key={ticket.id}
                ticket={ticket}
                onPress={handleCardPress}
              />
            ))}
            {isFetching || isLoadingMore ? (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null}
          </>
        ) : (
          <ThemedText type="xs" style={styles.empty}>
            No support requests yet.
          </ThemedText>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      paddingTop: 20,
      paddingBottom: 40,
    },
    reportButton: {
      marginBottom: 20,
    },
    loader: {
      marginTop: 40,
    },
    loadMoreContainer: {
      alignItems: "center",
      marginTop: 8,
    },
    empty: {
      textAlign: "center",
      color: colors.secondary,
      marginTop: 40,
    },
  });
