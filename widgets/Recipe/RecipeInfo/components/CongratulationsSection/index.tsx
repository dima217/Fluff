import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Fluffy from "@/assets/images/Fluffy.svg";

import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Feather } from "@expo/vector-icons";
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
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  const { t } = useTranslation();

  const handleRate = (value: number) => {
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
              const filled = starValue <= stars;

              return (
                <TouchableOpacity
                  key={starValue}
                  onPress={() => handleRate(starValue)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={filled ? "star" : "star"}
                    size={28}
                    color={filled ? colors.primary : colors.secondary}
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

const createstyles = (colors: AppColors) => StyleSheet.create({
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
    color: colors.secondary,
  },
  starsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  ratingText: {
    marginTop: 8,
    color: colors.secondary,
  },
});

export default CongratulationsSection;
