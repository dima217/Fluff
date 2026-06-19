import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ActionSheetOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  isVisible: boolean;
  title?: string;
  options: ActionSheetOption[];
  cancelLabel?: string;
  onClose: () => void;
}

const SLIDE_DURATION = 220;

const ActionSheet = ({
  isVisible,
  title,
  options,
  cancelLabel = "Отмена",
  onClose,
}: ActionSheetProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: SLIDE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: SLIDE_DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, translateY]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[styles.sheetWrapper, { transform: [{ translateY }] }]}
        >
          {/* Options panel */}
          <Pressable style={styles.panel}>
            {title ? (
              <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
              </View>
            ) : null}

            {options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.optionRow,
                  idx < options.length - 1 && styles.optionBorder,
                  idx === 0 && !title && styles.optionFirst,
                  idx === options.length - 1 && styles.optionLast,
                ]}
                onPress={() => {
                  opt.onPress();
                  onClose();
                }}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.optionText,
                    opt.destructive && { color: colors.reject },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>

          {/* Cancel button — separate card below */}
          <TouchableOpacity
            style={styles.cancelPanel}
            onPress={onClose}
            activeOpacity={0.6}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "flex-end",
    },
    sheetWrapper: {
      paddingHorizontal: 8,
      paddingBottom: 28,
      gap: 8,
    },
    panel: {
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: colors.tab,
    },
    titleRow: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    title: {
      color: colors.secondary,
      fontSize: 13,
      textAlign: "center",
    },
    optionRow: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    optionFirst: {
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
    },
    optionLast: {
      borderBottomLeftRadius: 14,
      borderBottomRightRadius: 14,
    },
    optionBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    optionText: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: "400",
    },
    cancelPanel: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      backgroundColor: colors.tab,
    },
    cancelText: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "600",
    },
  });

export default ActionSheet;
