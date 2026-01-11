import { CircleSizes } from "@/constants/components/CIrcle";
import { Colors } from "@/constants/design-tokens";
import Circle from "@/shared/ui/Circle";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View } from "react-native";

interface MarkerProps {
  color?: string;
  text?: string;
}

const Marker = ({ color = Colors.primary, text = "1" }: MarkerProps) => {
  return (
    <View style={styles.container}>
      <Circle size={CircleSizes.MARKER} color={color} />
      <ThemedText type="xs">{text}</ThemedText>
    </View>
  );
};

export default Marker;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
});
