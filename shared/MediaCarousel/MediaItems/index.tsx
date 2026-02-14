import { useMediaUrl } from "@/api";
import { CircleSizes } from "@/constants/components/CIrcle";
import Avatar from "@/shared/ui/Avatar";
import Circle from "@/shared/ui/Circle";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const SHORT_CARD_WIDTH = Dimensions.get("window").width * 0.7;
const SHORT_CARD_HEIGHT = SHORT_CARD_WIDTH * 0.6;

const LONG_CARD_WIDTH = Dimensions.get("window").width * 0.9;
const LONG_CARD_HEIGHT = LONG_CARD_WIDTH * 0.6;

const REAL_IMAGE_URL =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop";

type MediaCarouselItemProps = {
  title: string;
  author: string;
  imageUrl?: string;
  videoUrl?: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: "short" | "long";
};

const MediaCarouselItem = ({
  title,
  author,
  imageUrl,
  videoUrl,
  onPress,
  style,
  variant = "short",
}: MediaCarouselItemProps) => {
  const isLongVariant = variant === "long";
  const { url: mediaUrl, headers: mediaHeaders } = useMediaUrl(imageUrl, {
    skip: !imageUrl,
  });
  const sourceUri = mediaUrl || imageUrl || REAL_IMAGE_URL;
  const source =
    mediaUrl && mediaHeaders
      ? { uri: mediaUrl, headers: mediaHeaders }
      : { uri: sourceUri };

  const cardWidth = isLongVariant ? LONG_CARD_WIDTH : SHORT_CARD_WIDTH;
  const cardHeight = isLongVariant ? LONG_CARD_HEIGHT : SHORT_CARD_HEIGHT;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        style,
        { width: cardWidth, height: isLongVariant ? "auto" : cardHeight },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.imageWrapper,
          { height: isLongVariant ? cardHeight : "100%", width: "100%" },
        ]}
      >
        <ImageBackground
          source={source}
          style={styles.imageBackground}
          imageStyle={styles.image}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            locations={[0.5, 1]}
            style={styles.gradientOverlay}
          >
            <View style={styles.playButtonContainer}>
              <Circle
                svg={<Ionicons name="play" size={24} color="#FFF" />}
                frostedGlass
                onPress={() => {}}
              />
            </View>
            {/* Text for short variant */}
            {!isLongVariant && (
              <View style={styles.textContainerShort}>
                <ThemedText type="s">{title}</ThemedText>
                <ThemedText type="xs">{author}</ThemedText>
              </View>
            )}
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Text for long variant */}
      {isLongVariant && (
        <View style={styles.longContainer}>
          <Avatar size={CircleSizes.MINI} title="K" />
          <View style={styles.textContainerLong}>
            <ThemedText type="mini">{title}</ThemedText>
            <ThemedText type="xs" style={{ fontSize: 8 }}>
              {author}
            </ThemedText>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(MediaCarouselItem);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  imageWrapper: {
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
    borderRadius: 16,
    overflow: "hidden",
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  textContainerShort: {
    flexDirection: "column",
    alignSelf: "flex-start",
    gap: 4,
  },
  longContainer: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainerLong: {
    flexDirection: "column",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
