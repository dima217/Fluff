import { useColors } from "@/contexts/ThemeContext";
import { ActivityIndicator as NativeActivityIndicator } from "react-native";

import type { ActivityIndicatorProps } from "react-native";

const ActivityIndicator = ({ color, ...rest }: ActivityIndicatorProps) => {
  const colors = useColors();

  return (
    <NativeActivityIndicator
      size="large"
      color={color ?? colors.secondary}
      {...rest}
    />
  );
};

export default ActivityIndicator;
