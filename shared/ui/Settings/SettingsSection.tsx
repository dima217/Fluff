import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View, type ViewProps } from "react-native";

interface SettingsSectionProps extends ViewProps {
  title: string;
  footer?: string;
  children: React.ReactNode;
}

const SettingsSection = ({
  title,
  footer,
  children,
  style,
  ...rest
}: SettingsSectionProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.section, style]} {...rest}>
      <ThemedText type="caption" color="secondary" style={styles.title}>
        {title}
      </ThemedText>
      {children}
      {footer ? (
        <ThemedText type="caption" color="secondary" style={styles.footer}>
          {footer}
        </ThemedText>
      ) : null}
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      gap: 8,
    },
    title: {
      paddingHorizontal: 4,
    },
    footer: {
      paddingHorizontal: 4,
      lineHeight: 18,
    },
  });

export default SettingsSection;
