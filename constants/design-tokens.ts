import { Platform } from "react-native";

const brand = {
  primary: "#E95285",
  purple: "#5B3E62",
  green: "#33AD2D",
  reject: "#ff4a75",
  cheatMeal: "#7CCF77",
  strongExcess: "#FF6D38",
  insufficientIntake: "#3D80BA",
} as const;

export const ColorPalette = {
  dark: {
    ...brand,
    text: "#E4E4E4",
    secondary: "#8B868F",
    label: "#8B868F",
    inactive: "#1A1A1A",
    background: "#0F0F0F",
    tab: "#232323",
    border: "#5B5B5B",
    gradient: ["#1A1A1A", "#242424"] as const,
    notTracked: "#D9D9D9",
    onPrimary: "#FFFFFF",
    card: "#1E1E1E",
    iconMuted: "#8B868F",
    overlay: "rgba(0, 0, 0, 0.6)",
    overlaySubtle: "rgba(255, 255, 255, 0.05)",
    overlayMedium: "rgba(255, 255, 255, 0.1)",
    pattern: "rgba(255, 255, 255, 0.05)",
    videoBackground: "#000000",
  },
  light: {
    ...brand,
    text: "#1A1A1A",
    secondary: "#4A4558",
    label: "#4A4558",
    inactive: "#F2F0F4",
    background: "#FFFFFF",
    tab: "#F5F5F5",
    border: "#B8B2BE",
    gradient: ["#F0F0F0", "#E8E6EB"] as const,
    notTracked: "#7A7580",
    onPrimary: "#FFFFFF",
    card: "#E8E6EB",
    iconMuted: "#6E6878",
    overlay: "rgba(0, 0, 0, 0.5)",
    overlaySubtle: "rgba(0, 0, 0, 0.05)",
    overlayMedium: "rgba(0, 0, 0, 0.1)",
    pattern: "rgba(0, 0, 0, 0.04)",
    videoBackground: "#F2F0F4",
  },
} as const;

export type ColorSchemeName = keyof typeof ColorPalette;
export type AppColors = (typeof ColorPalette)[ColorSchemeName];

/** @deprecated Prefer useColors() — static reference is always the dark palette */
export const Colors = ColorPalette.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
