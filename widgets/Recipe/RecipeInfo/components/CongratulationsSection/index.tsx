import Fluffy from "@/assets/images/Fluffy.svg";
import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CongratulationsSectionProps {
  stars?: number;
  onRate?: (stars: number) => void;
}

const MAX_STARS = 5;

const CongratulationsSection = ({
  stars = 0,
  onRate,
}: CongratulationsSectionProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(stars);

  const handleRate = (value: number) => {
    setRating(value);
    onRate?.(value);
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("@/assets/images/Light.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Fluffy width={250} height={250} />
        <View style={styles.content}>
          <ThemedText type="subtitle">{t("recipe.congratulations")}</ThemedText>

          <View style={styles.starsRow}>
            {Array.from({ length: MAX_STARS }).map((_, index) => {
              const starValue = index + 1;
              const filled = starValue <= rating;

              return (
                <TouchableOpacity
                  key={starValue}
                  onPress={() => handleRate(starValue)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={filled ? "star" : "star"}
                    size={28}
                    color={filled ? Colors.primary : Colors.secondary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <ThemedText type="notion" style={styles.description}>
            You did a great job! The recipe is now complete. Please rate the
            dish you made.
          </ThemedText>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 450,
    paddingBottom: 120,
  },
  content: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  description: {
    textAlign: "center",
    color: Colors.secondary,
  },
  starsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  ratingText: {
    marginTop: 8,
    color: Colors.secondary,
  },
});

export default CongratulationsSection;
