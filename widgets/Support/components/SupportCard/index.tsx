import { Ticket } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SupportCardProps {
  ticket: Ticket;
  onPress?: (ticket: Ticket) => void;
}

const formatDate = (raw: string | Date): string => {
  const date = typeof raw === "string" ? new Date(raw) : raw;
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${h12}:${minutes} ${period}  ${day} ${month}, ${year}`;
};

const SupportCard: React.FC<SupportCardProps> = ({ ticket, onPress }) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { subject, createdAt, adminSeen, hasUnreadAdminMessage } = ticket;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(ticket)}
      style={[
        styles.cardWrapper,
        hasUnreadAdminMessage && styles.cardWrapperActive,
      ]}
    >
      <GradientView style={styles.card}>
        <View style={styles.row}>
          <ThemedText type="s" style={styles.subject} numberOfLines={1}>
            {subject}
          </ThemedText>
          {adminSeen && (
            <ThemedText style={[styles.seen, { color: colors.green }]}>
              Seen
            </ThemedText>
          )}
        </View>

        <ThemedText type="xs" style={styles.date}>
          {formatDate(createdAt)}
        </ThemedText>

        {hasUnreadAdminMessage && (
          <View
            style={[styles.unreadBadge, { backgroundColor: colors.primary }]}
          />
        )}
      </GradientView>
    </TouchableOpacity>
  );
};

export default SupportCard;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    cardWrapper: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },
    cardWrapperActive: {
      padding: 3,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.background,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 20,
    },
    card: {
      flex: 0,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    subject: {
      flex: 1,
      marginRight: 8,
    },
    seen: {
      fontSize: 13,
      fontWeight: "600",
    },
    date: {
      color: colors.secondary,
    },
    unreadBadge: {
      position: "absolute",
      top: 6,
      right: 12,
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });
