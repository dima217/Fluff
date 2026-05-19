import { AppColors, ColorPalette, ColorSchemeName } from "@/constants/design-tokens";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { createContext, useContext, useMemo } from "react";

type ThemeContextValue = {
  colors: (typeof ColorPalette)[ColorSchemeName];
  colorScheme: ColorSchemeName;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: ColorPalette.dark,
  colorScheme: "dark",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const colorScheme: ColorSchemeName =
    systemScheme === "light" ? "light" : "dark";
  const colors = ColorPalette[colorScheme];

  const value = useMemo(
    () => ({ colors, colorScheme }),
    [colors, colorScheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useColors(): (typeof ColorPalette)[ColorSchemeName] {
  return useContext(ThemeContext).colors;
}

export function useAppColorScheme(): ColorSchemeName {
  return useContext(ThemeContext).colorScheme;
}
