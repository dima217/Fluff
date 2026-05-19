import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import {
  View as RNView,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from "react-native";
import { AppColors } from "@/constants/design-tokens";

interface CustomViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const View: React.FC<CustomViewProps> = ({ style, children, ...rest }) => {
  const styles = useThemedStyles(createViewStyles);

  return (
    <RNView style={[styles.container, style]} {...rest}>
      {children}
    </RNView>
  );
};

const createViewStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingVertical: 32,
    },
  });

export default View;
