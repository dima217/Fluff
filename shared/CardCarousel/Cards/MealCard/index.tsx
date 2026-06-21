import { Image, TouchableOpacity, View } from "react-native";

import { useMediaUrl } from "@/api";
import Heart from "@/assets/images/Heart.svg";
import Check from "@/assets/images/Сheck.svg";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/ui/ThemedText";
import React from "react";
import { createMealCardStyles } from "./styles";

interface RecipeCardProps {
  title: string;
  calories: string;
  imageUrl: string;
  status?: string;
  variant: "carousel" | "list";
  onPress: () => void;
  onLikePress?: () => void;
  isLiked?: boolean;
  rightAction?: React.ReactNode;
  isFluff: boolean;
}

const MealCard = ({
  title,
  calories,
  imageUrl,
  onPress,
  onLikePress,
  variant,
  isFluff,
  isLiked = false,
  rightAction,
}: RecipeCardProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createMealCardStyles);
  const isCarouselItem = variant === "carousel";
  const { url: mediaUrl, headers: mediaHeaders } = useMediaUrl(imageUrl, {
    skip: !imageUrl,
  });

  const handleLikePress = (e: any) => {
    e?.stopPropagation?.();
    onLikePress?.();
  };

  const renderActionIcon = () => {
    if (rightAction != null) return rightAction;
    if (isCarouselItem) {
      const strokeColor = isLiked ? colors.primary : colors.iconMuted;
      const fillColor = isLiked ? colors.primary : "none";

      return (
        <TouchableOpacity onPress={handleLikePress} activeOpacity={0.7}>
          <Heart
            width={24}
            height={24}
            stroke={strokeColor}
            fill={fillColor}
            strokeWidth={fillColor === colors.primary ? 0 : 1}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        isCarouselItem ? styles.carouselContainer : "",
      ]}
      onPress={onPress}
    >
      <View
        style={[
          isCarouselItem
            ? styles.carouselImageWrapper
            : styles.fullWidthImageWrapper,
        ]}
      >
        <Image
          source={
            mediaUrl
              ? {
                  uri: mediaUrl,
                  ...(mediaHeaders && { headers: mediaHeaders }),
                }
              : require("@/assets/images/FoodAva.png")
          }
          style={styles.cardImage}
        />
      </View>

      <View
        style={[
          styles.contentContainer,
          isCarouselItem && styles.carouselContentContainer,
        ]}
      >
        <View style={styles.textDetails}>
          <ThemedText numberOfLines={1} type="xs" style={styles.title}>
            {title}
          </ThemedText>
          <View style={styles.recipeStatusTextContainer}>
            <ThemedText type="xs">{calories}</ThemedText>
            {isFluff && (
              <View style={styles.statusContainer}>
                <ThemedText style={{ color: colors.text }} type="xs">
                  Fluff
                </ThemedText>
                <Check width={14} height={14} />
              </View>
            )}
          </View>
        </View>
        {renderActionIcon()}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MealCard);
