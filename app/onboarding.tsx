import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import VideoSlider from "@/shared/LandingVideo";
import Swiper from "@/shared/Swiper";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import Cutlery from "../assets/images/Cutlery.svg";

const { height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      {/* --- Top Video Section --- */}
      <View style={styles.videoSection}>
        <VideoSlider />
      </View>

      {/* --- Text Content --- */}
      <View style={styles.content}>
        {/* Header with Icon */}
        <View style={styles.headerRow}>
          <Cutlery width={22} height={22} />
          <ThemedText type="mini" highlightLastWord>
            {t("onboarding.culinaryConstructor")}
          </ThemedText>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <ThemedText type="title" highlightLastWord>
            {t("onboarding.soundMind")}
          </ThemedText>
          <ThemedText type="title" highlightLastWord>
            {t("onboarding.soundBody")}
          </ThemedText>
        </View>

        {/* Subtitle / Notion */}
        <ThemedText type="notion" style={styles.notionText}>
          {t("onboarding.trackDaily")}
        </ThemedText>

        <Swiper onSwipeEnd={() => router.replace("/(auth)/login")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  videoSection: {
    height: height * 0.55,
    width: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleBlock: {
    gap: 4,
  },
  notionText: {
    color: Colors.secondary,
    lineHeight: 22,
    opacity: 0.85,
  },
});
