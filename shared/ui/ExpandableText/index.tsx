import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";

interface ExpandableTextProps {
  children: string;
  /** Collapsed line count before "show more" appears */
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  toggleStyle?: StyleProp<TextStyle>;
  showMoreLabel?: string;
  showLessLabel?: string;
}

const ExpandableText = ({
  children,
  numberOfLines = 2,
  style,
  toggleStyle,
  showMoreLabel,
  showLessLabel,
}: ExpandableTextProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const text = children?.trim() ?? "";
  const moreLabel = showMoreLabel ?? t("common.showMore");
  const lessLabel = showLessLabel ?? t("common.showLess");

  useEffect(() => {
    setExpanded(false);
    setIsTruncated(false);
  }, [text, numberOfLines]);

  if (!text) return null;

  const showToggle = isTruncated || expanded;

  return (
    <View style={styles.container}>
      <Text
        style={[styles.measureText, style]}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        onTextLayout={(event) => {
          if (!expanded) {
            setIsTruncated(event.nativeEvent.lines.length > numberOfLines);
          }
        }}
      >
        {text}
      </Text>

      <Text style={style} numberOfLines={expanded ? undefined : numberOfLines}>
        {text}
      </Text>

      {showToggle ? (
        <Pressable
          onPress={() => setExpanded((prev) => !prev)}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text style={[styles.toggle, { color: colors.primary }, toggleStyle]}>
            {expanded ? lessLabel : moreLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const createStyles = (_colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexShrink: 1,
      minWidth: 0,
      alignSelf: "stretch",
      overflow: "hidden",
    },
    measureText: {
      position: "absolute",
      opacity: 0,
      zIndex: -1,
      pointerEvents: "none",
      left: 0,
      right: 0,
    },
    toggle: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: "500",
    },
  });

export default ExpandableText;
