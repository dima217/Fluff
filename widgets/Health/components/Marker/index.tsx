import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { CircleSizes } from "@/constants/components/CIrcle";

import Circle from "@/shared/ui/Circle";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View } from "react-native";

interface MarkerProps {
  color?: string;
  text?: string;
}

const Marker = ({ color, text = "1" }: MarkerProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  return (
    <View style={styles.container}>
      <Circle size={CircleSizes.MARKER} color={color ?? colors.primary} />
      <ThemedText type="xs">{text}</ThemedText>
    </View>
  );
};

export default Marker;

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
});
