import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const CARD_WIDTH = Dimensions.get("window").width * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 0.6;
const REAL_IMAGE_URL =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop";

type MediaCarouselItemProps = {
  title: string;
  author: string;
  imageUrl?: string;
  onPress: () => void;
  style?: ViewStyle;
};

const MediaCarouselItem = ({
  title,
  author,
  imageUrl,
  onPress,
  style,
}: MediaCarouselItemProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        style,
        { width: CARD_WIDTH, height: CARD_HEIGHT },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: imageUrl || REAL_IMAGE_URL }}
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
            <View style={styles.playButton}>
              <Ionicons name="play" size={24} color="#FFF" />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.authorText}>{author}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default memo(MediaCarouselItem);

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  playButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  textContainer: {
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  authorText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
});
