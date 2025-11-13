import { ThemedText } from "@/components/ui/ThemedText";
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

export interface FoodUploadCardProps extends TouchableOpacityProps {
  title: string;
  imageSource: ImageSourcePropType;
  backgroundImage: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

const FoodUploadCard = ({
  title,
  imageSource,
  backgroundImage,
  onPress,
  style,
}: FoodUploadCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <View style={styles.backgroundImage}>
        <Image source={backgroundImage} resizeMode="cover" />
      </View>
      <ThemedText type="s" style={{ fontSize: 12 }}>
        {title}
      </ThemedText>
      <View style={styles.imageContainer}>
        <Image source={imageSource} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    zIndex: 10,
  },
  imageContainer: {
    width: 126,
    height: 146,
    paddingTop: 60,
    zIndex: 5,
  },
  backgroundImage: {
    height: 133,
    width: 130,
    position: "absolute",
    left: 0,
    bottom: 0,
  },
});

export default FoodUploadCard;
