import { Colors } from "@/constants/design-tokens";
import { ImageBackground, StyleSheet } from "react-native";

interface CongratulationsSectionProps {
  stars?: number;
}

const CongratulationsSection = ({ stars }: CongratulationsSectionProps) => {
  return (
    <ImageBackground
      source={require("@/assets/images/Cake.png")}
      style={styles.background}
      resizeMode="cover"
    ></ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  innerContainer: {
    width: "100%",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 40,
  },
  background: {
    width: "100%",
    height: 500,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 30,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
});

export default CongratulationsSection;
