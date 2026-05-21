import { useDeleteTrackingMutation, useGetRecipesByIdsQuery } from "@/api";
import type { TrackingResponse } from "@/api/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Button from "@/shared/Buttons/Button";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { getGroupedTrackingRecords } from "../../utils";
import TrackingItem from "./ui/TrackingItem";

interface TrackingHistoryProps {
  records: TrackingResponse[];
  onPress: (recipeId?: number) => void;
  onDeleteSuccess?: () => void;
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({
  records,
  onPress,
  onDeleteSuccess,
}) => {
  const styles = useThemedStyles(createstyles);
  const colors = useColors();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleteTracking] = useDeleteTrackingMutation();

  const recipeIds = [
    ...new Set(
      records
        .map((record) => record.recipeId)
        .filter((id): id is number => id != null)
    ),
  ];

  const { data: recipes } = useGetRecipesByIdsQuery(recipeIds, {
    skip: recipeIds.length === 0,
  });

  if (!records || records.length === 0) {
    return null;
  }

  const groupedRecords = getGroupedTrackingRecords(records, recipes || []);

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleEnterEdit = () => {
    setIsEditMode(true);
    setSelectedIds(new Set());
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    await Promise.all([...selectedIds].map((id) => deleteTracking(id)));
    setSelectedIds(new Set());
    onDeleteSuccess?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="s" style={styles.headerTitle}>
          Daily menu
        </ThemedText>

        {isEditMode ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.trashButton}
              onPress={handleDeleteSelected}
              disabled={selectedIds.size === 0}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={
                  selectedIds.size > 0 ? colors.reject : colors.secondary
                }
              />
            </TouchableOpacity>
            <View style={styles.saveButtonContainer}>
              <Button
                title="Save"
                onPress={handleSaveEdit}
                style={styles.saveButton}
                textStyle={styles.saveButtonText}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEnterEdit}
          >
            <ThemedText type="xs" style={styles.editText}>
              Edit
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {Object.entries(groupedRecords).map(([timeKey, timeRecords]) => (
        <View key={timeKey} style={styles.timeSection}>
          <View style={styles.timeMarker}>
            <View style={styles.timeLine} />
            <ThemedText type="xs" style={styles.timeText}>
              {timeKey}
            </ThemedText>
          </View>
          {timeRecords.map((record) => (
            <TrackingItem
              key={record.id}
              record={record}
              onPress={onPress}
              isEditMode={isEditMode}
              isSelected={selectedIds.has(record.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const createstyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginTop: 20,
      gap: 20,
    },
    saveButtonContainer: {
      maxWidth: 150,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    editButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.tab,
      borderRadius: 8,
    },
    editText: {
      color: colors.text,
    },
    editActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    trashButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.tab,
      justifyContent: "center",
      alignItems: "center",
    },
    saveButton: {
      height: 32,
      paddingHorizontal: 16,
      paddingVertical: 0,
      minWidth: 64,
    },
    saveButtonText: {
      fontSize: 13,
    },
    timeSection: {
      gap: 12,
    },
    timeMarker: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    timeLine: {
      width: 2,
      height: 20,
      backgroundColor: colors.border,
    },
    timeText: {
      color: colors.secondary,
      fontSize: 12,
    },
  });

export default TrackingHistory;
