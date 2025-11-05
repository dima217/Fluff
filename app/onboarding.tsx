import Swiper from "@/components/Swiper";
import { ThemedText } from "@/components/ui/ThemedText";
import VideoSlider from "@/components/Video/videoSlider";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import Cutlery from "../assets/images/Cutlery.svg";

const { height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
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
            Culinary Constructor
          </ThemedText>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <ThemedText type="title" highlightLastWord>
            A Sound Mind
          </ThemedText>
          <ThemedText type="title" highlightLastWord>
            In A Sound Body
          </ThemedText>
        </View>

        {/* Subtitle / Notion */}
        <ThemedText type="notion" style={styles.notionText}>
          Track your daily dietary norms without much effort.
        </ThemedText>

        <Swiper onSwipeEnd={() => router.navigate("/(auth)/login")} />
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
