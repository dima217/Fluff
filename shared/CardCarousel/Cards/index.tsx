import { Image, TouchableOpacity, View } from "react-native";

import Heart from "@/assets/images/Heart.svg";
import Check from "@/assets/images/Сheck.svg";
import { useMediaUrl } from "@/api";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/ui/ThemedText";
import { styles } from "./styles";

interface RecipeCardProps {
  title: string;
  calories: string;
  imageUrl: string;
  status?: string;
  variant: "carousel" | "list";
  onPress: () => void;
  onLikePress?: () => void;
  isLiked?: boolean;
  /** Кастомная иконка справа (например редактирование). По умолчанию — лайк на carousel, ничего на list */
  rightAction?: React.ReactNode;
}

const MealCard = ({
  title,
  calories,
  imageUrl,
  status,
  onPress,
  onLikePress,
  variant,
  isLiked = false,
  rightAction,
}: RecipeCardProps) => {
  const isCarouselItem = variant === "carousel";
  const { url: mediaUrl, headers: mediaHeaders } = useMediaUrl(imageUrl, {
    skip: !imageUrl,
  });

  const handleLikePress = (e: any) => {
    e?.stopPropagation?.();
    if (onLikePress) {
      onLikePress();
    }
  };

  const renderActionIcon = () => {
    if (rightAction != null) return rightAction;
    if (isCarouselItem) {
      const strokeColor = isLiked ? Colors.primary : "#8B868F";
      const fillColor = isLiked ? Colors.primary : "none";

      return (
        <TouchableOpacity onPress={handleLikePress} activeOpacity={0.7}>
          <Heart
            width={24}
            height={24}
            stroke={strokeColor}
            fill={fillColor}
            strokeWidth={1}
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
              ? { uri: mediaUrl, ...(mediaHeaders && { headers: mediaHeaders }) }
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
          <ThemedText type="xs" style={{ color: "#FFFFFF", fontSize: 12 }}>
            {title}
          </ThemedText>
          <View>
            <ThemedText type="xs">{calories}</ThemedText>
            {status && (
              <View style={styles.statusContainer}>
                <ThemedText style={{ color: Colors.text }} type="xs">
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

export default MealCard;
