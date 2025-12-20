import { Colors, Fonts } from "@/constants/design-tokens";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  titleSize?: number;
  highlightLastWord?: boolean;
  type?: "title" | "subtitle" | "default" | "mini" | "notion" | "s" | "xs";
  fontFamilyType?: "sans" | "serif" | "rounded" | "mono";
};

const getStylesByType = (type: ThemedTextProps["type"]) => {
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
  /* const [fontsLoaded] = useFonts({
    'SFProText-Medium': require('../../assets/fonts/SFProText-Medium.ttf'),
  }); 

  if (!fontsLoaded) {
    return null; 
  } */

  const color = Colors.text;

  if (typeof children === "string") {
    const words = children.trim().split(" ");
    const text = words.join(" ");
    const baseStyle = getStylesByType(type);

    if (highlightLastWord) {
      const lastWord = words.pop();
      const textWithoutLast = words.join(" ");

      return (
        <Text
          style={[
            { color, fontFamily: Fonts[fontFamilyType] },
            baseStyle,
            titleSize
              ? { fontSize: titleSize, lineHeight: titleSize + 2 }
              : null,
            style,
          ]}
          {...rest}
        >
          {textWithoutLast}{" "}
          <Text
            style={{ color: Colors.primary, fontFamily: Fonts[fontFamilyType] }}
          >
            {lastWord}
          </Text>
        </Text>
      );
    }

    return (
      <Text
        style={[{ color, fontFamily: Fonts[fontFamilyType] }, baseStyle, style]}
        {...rest}
      >
        {text}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8B868F",
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
    color: "#8B868F",
  },
  notion: {
    fontSize: 14,
    color: "#8B868F",
    fontWeight: "100",
    opacity: 50,
  },
});
