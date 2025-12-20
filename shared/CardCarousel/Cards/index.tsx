import { Image, TouchableOpacity, View } from "react-native";

import Heart from "@/assets/images/Heart.svg";
import Check from "@/assets/images/Сheck.svg";
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
  isLiked?: boolean;
}

const MealCard = ({
  title,
  calories,
  imageUrl,
  status,
  onPress,
  variant,
  isLiked = false,
}: RecipeCardProps) => {
  const isCarouselItem = variant === "carousel";

  const renderActionIcon = () => {
    if (isCarouselItem) {
      return (
        <Heart
          width={24}
          height={24}
          color={isLiked ? Colors.primary : "transparent"}
        />
      );
    } else {
      return null;
    }
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
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
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
