import { Colors } from "@/constants/design-tokens";
import Circle from "@/shared/ui/Circle";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RecipeCardProps {
  title: string;
  category: string;
  restaurant: string;
  rating: number;
  time: string;
  calories: number;
  description: string;
  onLike?: () => void;
  onMenu?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  category,
  restaurant,
  rating,
  time,
  calories,
  description,
  onLike,
  onMenu,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {category} • {restaurant}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <Circle
            onPress={onLike}
            svg={<Ionicons name="heart" size={24} color={Colors.primary} />}
            color={Colors.inactive}
          />
          <Circle
            onPress={onLike}
            svg={<MaterialIcons name="more-vert" size={24} color="#aaa" />}
            color={Colors.inactive}
          />
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <FontAwesome name="star" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{rating.toFixed(1)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{time}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Ionicons name="fast-food-outline" size={16} color={Colors.purple} />
          <Text style={styles.infoText}>{calories} Ccal</Text>
        </View>
      </View>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: Colors.purple,
    marginLeft: 4,
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: "#555",
    marginHorizontal: 12,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RecipeCard;
