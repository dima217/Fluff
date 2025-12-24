import { CircleSizes } from "@/constants/components/CIrcle";
import Button from "@/shared/Buttons/Button";
import Avatar from "@/shared/ui/Avatar";
import GradientView from "@/shared/ui/GradientView";
import PatternBackground from "@/shared/ui/PatternBackground";
import RadialGradientBackground from "@/shared/ui/RadialGradientBackground";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View } from "react-native";
import TimeLabel from "./ui/TimeLabel";

const ProfileCard = () => {
  return (
    <GradientView style={styles.container}>
      <PatternBackground style={styles.patternContainer} />
      <RadialGradientBackground style={styles.radialContainer} />
      <View style={styles.profileRow}>
        <Avatar size={CircleSizes.MEDIUM} title="K" />
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          title="Edit"
          onPress={() => {}}
        />
      </View>
      <View style={styles.profileInfoColumn}>
        <TimeLabel />
        <ThemedText type="subtitle">Katsiaryna Shydlouskaya</ThemedText>
        <ThemedText type="notion">katrinkaling@gmail.com</ThemedText>
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
    borderRadius: 20,
  },
  radialContainer: {
    borderRadius: 20,
    ...StyleSheet.absoluteFillObject,
  },
  patternContainer: {
    borderRadius: 20,
    height: 100,
    ...StyleSheet.absoluteFillObject,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileInfoColumn: {
    marginTop: 35,
    gap: 6,
  },
  button: {
    width: 64,
    height: 30,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 12,
  },
});

export default ProfileCard;
