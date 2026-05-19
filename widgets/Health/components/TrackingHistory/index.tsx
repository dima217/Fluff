import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useGetRecipesByIdsQuery } from "@/api";
import type { TrackingResponse } from "@/api/types";

import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { getGroupedTrackingRecords } from "../../utils";
import TrackingItem from "./ui/TrackingItem";

interface TrackingHistoryProps {
  records: TrackingResponse[];
  onPress: (recipeId?: number) => void;
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({
  records,
  onPress,
}) => {
  const styles = useThemedStyles(createstyles);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="s" style={styles.headerTitle}>
          Daily menu
        </ThemedText>
        <TouchableOpacity style={styles.editButton}>
          <ThemedText type="xs" style={styles.editText}>
            Edit
          </ThemedText>
        </TouchableOpacity>
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
            <TrackingItem onPress={onPress} key={record.id} record={record} />
          ))}
        </View>
      ))}
    </View>
  );
};

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 20,
    gap: 20,
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
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.inactive,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  calories: {
    color: colors.text,
    fontSize: 12,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  source: {
    color: colors.secondary,
    fontSize: 12,
  },
  iconContainer: {
    padding: 4,
  },
});

export default TrackingHistory;
