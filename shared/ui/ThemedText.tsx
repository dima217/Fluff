import { AppColors, Fonts } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { StyleSheet, Text, TextStyle, type TextProps } from "react-native";

// ─── Type scale ───────────────────────────────────────────────────────────────
//
//  display    32 / 400   hero text, onboarding headings
//  heading    20 / 700   section / page headings
//  title      17 / 600   card titles, sub-section labels
//  body       16 / 400   primary copy  (text colour)
//  secondary  16 / 400   secondary copy (secondary colour)
//  small      14 / 400   supporting text
//  caption    12 / 400   hints, errors, captions  (secondary colour)
//  hint       14 / 300   muted auxiliary notes    (iconMuted colour)
//
//  Legacy aliases (preserved for backward-compat):
//  "subtitle" → heading   "s"     → body
//  "default"  → secondary "xs"    → caption
//  "mini"     → small     "notion"→ hint
//  "title"    → display   (keep reading as old meaning)
// ─────────────────────────────────────────────────────────────────────────────

export type ThemedTextType =
  // ── semantic (new) ──────────────────────────────
  | "display"    // 32px  weight:400  – hero / onboarding
  | "heading"    // 20px  weight:700  – section headings
  | "title"      // 17px  weight:600  – card titles
  | "body"       // 16px  weight:400  – primary body (text colour)
  | "secondary"  // 16px  weight:400  – secondary body (secondary colour)
  | "small"      // 14px  weight:400  – supporting text
  | "caption"    // 12px  weight:400  – captions / hints
  | "hint"       // 14px  weight:300  – muted auxiliary notes
  // ── legacy (kept for backward-compat) ───────────
  | "subtitle"   // → heading
  | "default"    // → secondary
  | "s"          // → body
  | "xs"         // → caption
  | "mini"       // → small
  | "notion";    // → hint

export type ThemedTextWeight = "regular" | "medium" | "semibold" | "bold";
export type ThemedTextColor  = "text" | "primary" | "secondary" | "muted";

export type ThemedTextProps = TextProps & {
  type?:              ThemedTextType;
  /** Override font weight independently of the type. */
  weight?:            ThemedTextWeight;
  /** Semantic colour shorthand – overrides the type's default colour. */
  color?:             ThemedTextColor;
  /** Override font size. */
  size?:              number;
  /** Font family stack. */
  fontFamily?:        "sans" | "serif" | "rounded" | "mono";
  /** Renders the last word in `colors.primary`. Only works for string children. */
  highlightLastWord?: boolean;
  // ── legacy props ──────────────────────────────────
  /** @deprecated Use `size` instead. */
  titleSize?:         number;
  /** @deprecated Use `fontFamily` instead. */
  fontFamilyType?:    "sans" | "serif" | "rounded" | "mono";
};

// ─── Weight map ───────────────────────────────────────────────────────────────
const WEIGHT_MAP: Record<ThemedTextWeight, TextStyle["fontWeight"]> = {
  regular:  "400",
  medium:   "500",
  semibold: "600",
  bold:     "700",
};

// ─── Colour map ───────────────────────────────────────────────────────────────
function resolveColor(token: ThemedTextColor, colors: AppColors): string {
  switch (token) {
    case "primary":   return colors.primary;
    case "secondary": return colors.secondary;
    case "muted":     return colors.iconMuted;
    case "text":      return colors.text;
  }
}

// ─── Normalise legacy type names ──────────────────────────────────────────────
function normaliseType(type: ThemedTextType): ThemedTextType {
  switch (type) {
    case "subtitle": return "heading";
    case "default":  return "secondary";
    case "s":        return "body";
    case "xs":       return "caption";
    case "mini":     return "small";
    case "notion":   return "hint";
    default:         return type;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ThemedText({
  style,
  type            = "secondary",
  weight,
  color,
  size,
  fontFamily,
  highlightLastWord = false,
  children,
  // legacy
  titleSize,
  fontFamilyType,
  ...rest
}: ThemedTextProps) {
  const colors       = useColors();
  const styles       = useThemedStyles(createStyles);
  const resolvedType = normaliseType(type);
  const ff           = fontFamily ?? fontFamilyType ?? "sans";
  const finalSize    = size ?? titleSize;

  type SemanticType = Exclude<ThemedTextType, "subtitle" | "default" | "s" | "xs" | "mini" | "notion">;
  const typeStyle = styles[resolvedType as SemanticType];

  const composed: TextStyle[] = [
    { color: colors.text, fontFamily: Fonts[ff] },
    typeStyle,
    finalSize ? { fontSize: finalSize, lineHeight: finalSize * 1.3 } : undefined,
    weight    ? { fontWeight: WEIGHT_MAP[weight] }                   : undefined,
    color     ? { color: resolveColor(color, colors) }               : undefined,
    style as TextStyle,
  ].filter(Boolean) as TextStyle[];

  if (highlightLastWord && (typeof children === "string" || typeof children === "number")) {
    const words    = String(children).trim().split(" ");
    const lastWord = words.pop();
    const rest_    = words.join(" ");

    return (
      <Text style={composed} {...rest}>
        {rest_}{" "}
        <Text style={{ color: colors.primary, fontFamily: Fonts[ff] }}>
          {lastWord}
        </Text>
      </Text>
    );
  }

  return (
    <Text style={composed} {...rest}>
      {children}
    </Text>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    // ── semantic ────────────────────────────────────
    display: {
      fontSize:   32,
      fontWeight: "400",
      lineHeight: 38,
      color:      colors.text,
    },
    heading: {
      fontSize:   20,
      fontWeight: "700",
      color:      colors.text,
    },
    title: {
      fontSize:   17,
      fontWeight: "600",
      color:      colors.text,
    },
    body: {
      fontSize:   16,
      lineHeight: 24,
      color:      colors.text,
    },
    secondary: {
      fontSize:   16,
      lineHeight: 24,
      color:      colors.secondary,
    },
    small: {
      fontSize:   14,
      color:      colors.text,
    },
    caption: {
      fontSize:   12,
      color:      colors.secondary,
    },
    hint: {
      fontSize:   14,
      fontWeight: "300",
      color:      colors.iconMuted,
    },
  });
