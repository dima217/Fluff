import { useGetRecipeByIdQuery, useMediaUrl } from "@/api";
import type { TrackingResponse } from "@/api/types";
import Check from "@/assets/images/Сheck.svg";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface TrackingHistoryProps {
  records: TrackingResponse[];
}

interface TrackingItemProps {
  record: TrackingResponse;
}

const TrackingItem: React.FC<TrackingItemProps> = ({ record }) => {
  const { data: recipe } = useGetRecipeByIdQuery(record.recipeId!, {
    skip: !record.recipeId,
  });

  const recipeImageUrl =
    record.recipeId && recipe
      ? recipe.image?.cover || recipe.image?.preview || ""
      : "";
  const { url: mediaUrl, headers: mediaHeaders } = useMediaUrl(recipeImageUrl, {
    skip: !recipeImageUrl,
  });

  const imageSource =
    mediaUrl ?
      { uri: mediaUrl, ...(mediaHeaders && { headers: mediaHeaders }) }
    : require("@/assets/images/FoodAva.png");

  const source = record.recipeId
    ? recipe?.fluffAt
      ? "Fluff"
      : "Your recipe"
    : "Your recipe";

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <ThemedText type="xs" style={styles.title}>
          {record.name}
        </ThemedText>
        <ThemedText type="xs" style={styles.calories}>
          {record.calories} KK
        </ThemedText>
        <View style={styles.sourceContainer}>
          <ThemedText type="xs" style={styles.source}>
            {source}
          </ThemedText>
          {source === "Fluff" && <Check width={14} height={14} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TrackingHistory: React.FC<TrackingHistoryProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return null;
  }

  // Group records by time (created field)
  const groupedRecords = records.reduce(
    (acc, record) => {
      const date = new Date(record.created);
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const timeKey = `${displayHours}:${minutes} ${period}`;

      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }
      acc[timeKey].push(record);
      return acc;
    },
    {} as Record<string, TrackingResponse[]>
  );

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
            <TrackingItem key={record.id} record={record} />
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
