import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Switch,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

interface SettingsRowProps {
  label: string;
  value?: string;
  showChevron?: boolean;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SettingsRow = ({
  label,
  value,
  showChevron = false,
  onPress,
  switchValue,
  onSwitchChange,
  isLast = false,
  style,
}: SettingsRowProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const isSwitch = switchValue !== undefined;
  const isPressable = !isSwitch && onPress != null;

  const content = (
    <>
      <ThemedText type="body" style={styles.label}>
        {label}
      </ThemedText>

      <View style={styles.right}>
        {value ? (
          <ThemedText type="body" color="secondary" style={styles.value}>
            {value}
          </ThemedText>
        ) : null}
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.tab, true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={colors.tab}
          />
        ) : null}
        {showChevron ? (
          <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
        ) : null}
      </View>
    </>
  );

  return (
    <View style={style}>
      {isPressable ? (
        <Pressable
          style={({ pressed }) => [
            styles.row,
            pressed && styles.rowPressed,
          ]}
          onPress={onPress}
        >
          {content}
        </Pressable>
      ) : (
        <View style={styles.row}>{content}</View>
      )}
      {!isLast ? <View style={styles.separator} /> : null}
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      minHeight: 50,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    rowPressed: {
      backgroundColor: colors.overlaySubtle,
    },
    label: {
      flex: 1,
    },
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flexShrink: 0,
    },
    value: {
      textAlign: "right",
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginLeft: 16,
    },
  });

export default SettingsRow;
