import { AppColors } from "@/constants/design-tokens";
import { styles as buttonStyles } from "@/shared/Buttons/Button/styles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { StyleSheet, View, type ViewProps } from "react-native";

const SettingsGroup = ({ children, style, ...rest }: ViewProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.group, style]} {...rest}>
      {children}
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    group: {
      backgroundColor: colors.card,
      borderRadius: buttonStyles.container.borderRadius,
      overflow: "hidden",
    },
  });

export default SettingsGroup;
