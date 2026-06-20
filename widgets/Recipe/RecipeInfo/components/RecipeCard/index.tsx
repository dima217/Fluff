
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Circle from "@/shared/ui/Circle";
import ContextMenu, { ContextMenuItem } from "@/shared/ui/ContextMenu";
import ExpandableText from "@/shared/ui/ExpandableText";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { ReactNode, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecipeCardProps {
  title: string;
  category: string;
  restaurant: string;
  rating: number;
  time: string;
  calories: number;
  proteins?: number | null;
  fats?: number | null;
  carbs?: number | null;
  description: string;
  onLike?: () => void;
  menuItems?: ContextMenuItem[];
  onPress?: () => void;
  isLiked?: boolean;
  titleLines?: number;
  descriptionLines?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  category,
  restaurant,
  rating,
  time,
  calories,
  proteins,
  fats,
  carbs,
  description,
  onLike,
  menuItems,
  onPress,
  isLiked = false,
  titleLines = 2,
  descriptionLines = 2,
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  const { t } = useTranslation();
  const menuAnchorRef = useRef<View>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const macroItems: ReactNode[] = [];

  if (proteins != null) {
    macroItems.push(
      <View key="proteins" style={styles.macroItem}>
        <Text style={[styles.macroText, { color: colors.secondary }]}>
          {t("nutrition.proteinsShort")} {proteins.toFixed(1)}{t("nutrition.gUnit")}
        </Text>
      </View>,
    );
  }
  if (fats != null) {
    macroItems.push(
      <View key="fats" style={styles.macroItem}>
        <Text style={[styles.macroText, { color: colors.secondary }]}>
          {t("nutrition.fatsShort")} {fats.toFixed(1)}{t("nutrition.gUnit")}
        </Text>
      </View>,
    );
  }
  if (carbs != null) {
    macroItems.push(
      <View key="carbs" style={styles.macroItem}>
        <Text style={[styles.macroText, { color: colors.secondary }]}>
          {t("nutrition.carbsShort")} {carbs.toFixed(1)}{t("nutrition.gUnit")}
        </Text>
      </View>,
    );
  }

  const hasMenu = (menuItems?.length ?? 0) > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ExpandableText numberOfLines={titleLines} style={styles.title}>
            {title}
          </ExpandableText>
          <Text style={styles.subtitle}>{restaurant}</Text>
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
          {hasMenu ? (
            <View ref={menuAnchorRef} collapsable={false}>
              <Circle
                onPress={() => setMenuVisible(true)}
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
          ) : null}
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
          <Text style={styles.infoText}>{calories} {t("health.caloriesUnit")}</Text>
        </View>
      </View>

      {macroItems.length > 0 && (
        <View style={styles.macroRow}>
          {macroItems.map((item, index) => (
            <View key={index} style={styles.macroGroup}>
              {index > 0 ? <View style={styles.macroDivider} /> : null}
              {item}
            </View>
          ))}
        </View>
      )}

      {!!description && (
        <ExpandableText
          numberOfLines={descriptionLines}
          style={styles.description}
        >
          {description}
        </ExpandableText>
      )}

      {hasMenu ? (
        <ContextMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          anchorRef={menuAnchorRef}
          items={menuItems!}
        />
      ) : null}
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
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 26,
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
    flexShrink: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    rowGap: 6,
    marginBottom: 10,
  },
  macroGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroText: {
    fontSize: 13,
  },
  macroDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  description: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RecipeCard;
