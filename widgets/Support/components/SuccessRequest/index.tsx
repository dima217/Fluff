import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Fluffy from "@/assets/images/Fluffy.svg";

import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import { ThemedText } from "@/shared/ui/ThemedText";
import {
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

const CongratulationsSection = () => {
  const styles = useThemedStyles(createstyles);
  const { t } = useTranslation();

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

          <ThemedText type="notion" style={styles.description}>
            Thank you for helping us 
            make the app better
          </ThemedText>
        </View>
      </ImageBackground>
      <View style={styles.submitButton}>
      <Button
        title={t("auth.home")}
        onPress={() => {}}
        //disabled={isLoading}
        //loading={isLoading}
      />
    </View>
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
  submitButton: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
  },
  ratingText: {
    marginTop: 8,
    color: colors.secondary,
  },
});

export default CongratulationsSection;
