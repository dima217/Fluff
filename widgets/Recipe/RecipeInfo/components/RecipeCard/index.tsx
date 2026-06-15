
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Circle from "@/shared/ui/Circle";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  onPress?: () => void;
  isLiked?: boolean;
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
  onPress,
  isLiked = false,
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {restaurant}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <Circle
            onPress={onLike}
            svg={
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? colors.primary : colors.iconMuted}
              />
            }
            color={colors.inactive}
          />
          <Circle
            onPress={onMenu}
            svg={
              <MaterialIcons
                name="more-vert"
                size={24}
                color={colors.iconMuted}
              />
            }
            color={colors.inactive}
          />
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <FontAwesome name="star" size={16} color={colors.primary} />
          <Text style={styles.infoText}>{rating.toFixed(1)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={styles.infoText}>{time}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Ionicons name="fast-food-outline" size={16} color={colors.purple} />
          <Text style={styles.infoText}>{calories} Ccal</Text>
        </View>
      </View>

      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const createstyles = (colors: AppColors) => StyleSheet.create({
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
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.secondary,
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
    color: colors.purple,
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
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RecipeCard;
