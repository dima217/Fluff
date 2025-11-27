import { ThemedText } from "@/shared/ui/ThemedText";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

export interface CheatMealCardProps extends TouchableOpacityProps {
  title: string;
  textHint: string;
  overlayImage: ImageSourcePropType;
  backgroundImage: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

const CheatMealCard = ({
  title,
  textHint,
  overlayImage,
  backgroundImage,
  onPress,
  style,
}: CheatMealCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <View style={styles.backgroundImage}>
        <Image source={backgroundImage} resizeMode="cover" />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.content}>
          <ThemedText type="s" style={{ fontSize: 12 }}>
            {title}
          </ThemedText>
          <ThemedText type="xs" style={{ fontSize: 10 }}>
            {textHint}
          </ThemedText>
        </View>
        <View style={styles.overlayImageContainer}>
          <Image source={overlayImage} resizeMode="cover" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    overflow: "hidden",
    flex: 1,
    justifyContent: "flex-start",
  },
  content: {
    padding: 16,
    gap: 10,
    zIndex: 10,
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  textHint: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    lineHeight: 18,
  },
  overlayImageContainer: {
    alignSelf: "flex-end",
    width: 92,
    height: 65,
    zIndex: 5,
  },
  backgroundImage: {
    height: 98,
    width: 140,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  overlayImage: {
    opacity: 0.2,
  },
});

export default CheatMealCard;
