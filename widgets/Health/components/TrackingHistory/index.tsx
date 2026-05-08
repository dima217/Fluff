import { useGetRecipesByIdsQuery } from "@/api";
import type { TrackingResponse } from "@/api/types";
import { Colors } from "@/constants/design-tokens";
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

const styles = StyleSheet.create({
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
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.tab,
    borderRadius: 8,
  },
  editText: {
    color: Colors.text,
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
    backgroundColor: Colors.border,
  },
  timeText: {
    color: Colors.secondary,
    fontSize: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.tab,
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
    backgroundColor: Colors.inactive,
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
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  calories: {
    color: Colors.text,
    fontSize: 12,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  source: {
    color: Colors.secondary,
    fontSize: 12,
  },
  iconContainer: {
    padding: 4,
  },
});

export default TrackingHistory;
