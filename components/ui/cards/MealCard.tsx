import { Image, Text, TouchableOpacity, View } from "react-native";
import Circle from "../circle";

import ExpandRight from "@/assets/images/Expand_right.svg";
import Heart from "@/assets/images/Heart.svg";
import Check from "@/assets/images/Сheck.svg";
import { Colors } from "@/constants/Colors";
import { styles } from "./meal.card.style";

interface RecipeCardProps {
  title: string;
  calories: string;
  imageUrl: string;
  status?: string;
  onPress: () => void;
  isCarouselItem?: boolean;
  isLiked?: boolean;
}

const MealCard = ({
  title,
  calories,
  imageUrl,
  status,
  onPress,
  isCarouselItem = false,
  isLiked = false,
}: RecipeCardProps) => {
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
      return (
        <Circle
          size={48}
          svg={<ExpandRight width={24} height={24} />}
          onPress={onPress}
        />
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        isCarouselItem ? styles.carouselContainer : styles.fullWidthContainer,
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
          <Text style={[styles.title, isCarouselItem && styles.carouselTitle]}>
            {title}
          </Text>
          <Text
            style={[styles.calories, isCarouselItem && styles.carouselCalories]}
          >
            {calories} KK
          </Text>
          {status && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{status}</Text>
              <Check width={14} height={14} />
            </View>
          )}
        </View>
        <View style={styles.actionIconWrapper}>{renderActionIcon()}</View>
      </View>
    </TouchableOpacity>
  );
};

export default MealCard;
