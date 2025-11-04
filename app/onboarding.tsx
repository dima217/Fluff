import { ThemedText } from "@/components/ui/ThemedText";
import VideoSlider from "@/components/video/videoSlider";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import Cutlery from "../assets/images/Cutlery.svg";

export default function onboardingScreen() {
  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: "60%" }}>
        <VideoSlider />
      </View>
      <View style={styles.innerContainer}>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Cutlery />
          <ThemedText type="mini" highlightLastWord={true}>
            Culinary Constructor
          </ThemedText>
        </View>

        <View>
          <ThemedText type="title" highlightLastWord={true}>
            A Sound Mind
          </ThemedText>

          <ThemedText type="title" highlightLastWord={true}>
            In A Sound Body
          </ThemedText>
        </View>

        <ThemedText type="notion">
          {"Track your daily dietary norms without \n much effort"}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: Colors.background,
  },
  innerContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    gap: 16,
  },
});
