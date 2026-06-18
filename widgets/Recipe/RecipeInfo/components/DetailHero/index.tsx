import { AppColors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, View } from "react-native";

interface DetailHeroProps {
  coverUrl?: string | null;
  coverHeaders?: Record<string, string>;
  fallbackUri?: string | null;
  colors: AppColors;
  styles: {
    background: object;
    backgroundContent: object;
    gradient: object;
  };
}

const DetailHero = ({
  coverUrl,
  coverHeaders,
  fallbackUri,
  colors,
  styles,
}: DetailHeroProps) => {
  const source = coverUrl
    ? { uri: coverUrl, ...(coverHeaders && { headers: coverHeaders }) }
    : fallbackUri
      ? { uri: fallbackUri }
      : require("@/assets/images/Cake.png");

  return (
    <ImageBackground source={source} style={styles.background} resizeMode="cover">
      <View style={styles.backgroundContent}>
        <Header />
      </View>
      <LinearGradient colors={["transparent", colors.background]} style={styles.gradient} />
    </ImageBackground>
  );
};

export default DetailHero;
