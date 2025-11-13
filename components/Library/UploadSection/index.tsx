import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

export interface FoodUploadCardProps extends TouchableOpacityProps {
  title: string;
  imageSource: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

const FoodUploadCard = ({
  title,
  imageSource,
  onPress,
  style,
}: FoodUploadCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
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
    ...StyleSheet.absoluteFillObject,
    paddingTop: 60,
    zIndex: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default FoodUploadCard;
