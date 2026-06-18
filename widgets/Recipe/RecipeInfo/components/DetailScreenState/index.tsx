import { AppColors } from "@/constants/design-tokens";
import View from "@/shared/View";
import { ActivityIndicator, Text } from "react-native";

interface DetailScreenStateProps {
  styles: {
    loadingContainer?: object;
    errorContainer?: object;
    errorText?: object;
  };
  colors: AppColors;
  message?: string;
  variant: "loading" | "error";
}

const DetailScreenState = ({ styles, colors, message, variant }: DetailScreenStateProps) => (
  <View style={variant === "loading" ? styles.loadingContainer : styles.errorContainer}>
    {variant === "loading" ? (
      <ActivityIndicator size="large" color={colors.primary} />
    ) : (
      <Text style={styles.errorText}>{message}</Text>
    )}
  </View>
);

export default DetailScreenState;
