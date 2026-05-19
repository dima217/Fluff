import { AppColors, Fonts } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  titleSize?: number;
  highlightLastWord?: boolean;
  type?: "title" | "subtitle" | "default" | "mini" | "notion" | "s" | "xs";
  fontFamilyType?: "sans" | "serif" | "rounded" | "mono";
};

const getStylesByType = (
  type: ThemedTextProps["type"],
  styles: ReturnType<typeof createThemedTextStyles>
) => {
  switch (type) {
    case "title":
      return styles.title;
    case "subtitle":
      return styles.subtitle;
    case "mini":
      return styles.mini;
    case "s":
      return styles.s;
    case "xs":
      return styles.xs;
    case "default":
    default:
      return styles.default;
  }
};

export function ThemedText({
  style,
  type = "default",
  highlightLastWord = false,
  titleSize,
  children,
  fontFamilyType = "sans",
  ...rest
}: ThemedTextProps) {
  const colors = useColors();
  const styles = useThemedStyles(createThemedTextStyles);
  const color = colors.text;
  const baseStyle = getStylesByType(type, styles);

  const text =
    typeof children === "number" || typeof children === "string"
      ? String(children)
      : "";

  if (!text) {
    return <Text style={style} {...rest} />;
  }

  if (highlightLastWord) {
    const words = text.trim().split(" ");
    const lastWord = words.pop();
    const restText = words.join(" ");

    return (
      <Text
        style={[
          { color, fontFamily: Fonts[fontFamilyType] },
          baseStyle,
          titleSize ? { fontSize: titleSize, lineHeight: titleSize + 2 } : null,
          style,
        ]}
        {...rest}
      >
        {restText}{" "}
        <Text
          style={{
            color: colors.primary,
            fontFamily: Fonts[fontFamilyType],
          }}
        >
          {lastWord}
        </Text>
      </Text>
    );
  }

  return (
    <Text
      style={[
        { color, fontFamily: Fonts[fontFamilyType] },
        baseStyle,
        titleSize ? { fontSize: titleSize, lineHeight: titleSize + 2 } : null,
        style,
      ]}
      {...rest}
    >
      {text}
    </Text>
  );
}

const createThemedTextStyles = (colors: AppColors) =>
  StyleSheet.create({
    default: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.secondary,
    },
    title: {
      fontSize: 32,
      fontWeight: "400",
      lineHeight: 32,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
    mini: {
      fontSize: 14,
    },
    s: {
      fontSize: 16,
    },
    xs: {
      fontSize: 12,
      color: colors.secondary,
    },
    notion: {
      fontSize: 14,
      color: colors.iconMuted,
      fontWeight: "100",
    },
  });
