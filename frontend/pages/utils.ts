import { Theme } from "@/shared/settings";

const themeColorLight = "hsl(220deg 20% 100%)";
const themeColorDark = "hsl(220deg 20% 5%)";

export function getThemeColor(
  theme: Theme,
  preferredColorScheme: "light" | "dark",
) {
  const resolvedTheme = theme === "system" ? preferredColorScheme : theme;
  return {
    light: themeColorLight,
    dark: themeColorDark,
  }[resolvedTheme];
}
