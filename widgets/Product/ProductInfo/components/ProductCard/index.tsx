import Cookie from "@/assets/images/Cookie.svg";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Circle from "@/shared/ui/Circle";
import ExpandableText from "@/shared/ui/ExpandableText";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProductCardProps {
  title: string;
  calories: number;
  massa: number;
  favoritesCount: number;
  description?: string | null;
  proteins?: number | null;
  fats?: number | null;
  carbs?: number | null;
  onLike?: () => void;
  isLiked?: boolean;
  titleLines?: number;
  descriptionLines?: number;
}

const ProductCard = ({
  title,
  calories,
  massa,
  description,
  proteins,
  fats,
  carbs,
  onLike,
  isLiked = false,
  titleLines = 2,
  descriptionLines = 2,
}: ProductCardProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const infoItems: ReactNode[] = [
    <View key="calories" style={styles.infoItem}>
      <Cookie width={20} height={20} />
      <Text style={[styles.infoText, { color: colors.text }]}>
        {calories} {t("health.caloriesUnit")}
      </Text>
    </View>,
  ];

  if (proteins != null) {
    infoItems.push(
      <View key="proteins" style={styles.infoItem}>
        <Text style={styles.infoText}>
          {t("nutrition.proteinsShort")} {proteins.toFixed(1)} {t("nutrition.gUnit")}
        </Text>
      </View>,
    );
  }

  if (fats != null) {
    infoItems.push(
      <View key="fats" style={styles.infoItem}>
        <Text style={styles.infoText}>
          {t("nutrition.fatsShort")} {fats.toFixed(1)} {t("nutrition.gUnit")}
        </Text>
      </View>,
    );
  }

  if (carbs != null) {
    infoItems.push(
      <View key="carbs" style={styles.infoItem}>
        <Text style={styles.infoText}>
          {t("nutrition.carbsShort")} {carbs.toFixed(1)} {t("nutrition.gUnit")}
        </Text>
      </View>,
    );
  }

  infoItems.push(
    <View key="massa" style={styles.infoItem}>
      <Ionicons name="scale-outline" size={16} color={colors.primary} />
      <Text style={styles.infoText}>
        {massa} {t("recipe.gramsUnit")}
      </Text>
    </View>,
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ExpandableText numberOfLines={titleLines} style={styles.title}>
            {title}
          </ExpandableText>
          <Text style={styles.subtitle}>{t("product.per100g")}</Text>
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
        </View>
      </View>

      {!!description && (
        <ExpandableText
          numberOfLines={descriptionLines}
          style={styles.description}
        >
          {description}
        </ExpandableText>
      )}

      <View style={styles.infoRow}>
        {infoItems.map((item, index) => (
          <View key={index} style={styles.infoGroup}>
            {index > 0 ? <View style={styles.divider} /> : null}
            {item}
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
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
    description: {
      color: colors.secondary,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 12,
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
      flexWrap: "wrap",
      rowGap: 8,
    },
    infoGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    infoText: {
      color: colors.secondary,
      fontSize: 14,
    },
    divider: {
      width: 1,
      height: 16,
      backgroundColor: colors.border,
      marginHorizontal: 6,
    },
  });

export default ProductCard;
