import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
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
  /** Show lock icon (top right). When true = unlocked, false = locked */
  showLock?: boolean;
  isUnlocked?: boolean;
}

const CheatMealCard = ({
  title,
  textHint,
  overlayImage,
  backgroundImage,
  onPress,
  style,
  showLock,
  isUnlocked = true,
}: CheatMealCardProps) => {
  console.log("isUnlocked", isUnlocked);
  const locked = showLock && !isUnlocked;
  const handlePress = locked ? undefined : onPress;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, style, locked && styles.cardLocked]}
      activeOpacity={locked ? 1 : undefined}
      disabled={locked}
    >
      {showLock && (
        <View style={styles.lockIcon} pointerEvents="none">
          <Ionicons
            name={isUnlocked ? "lock-open-outline" : "lock-closed-outline"}
            size={20}
            color="rgba(255,255,255,0.9)"
          />
        </View>
      )}
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
  cardLocked: {
    opacity: 0.85,
  },
  lockIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 15,
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
