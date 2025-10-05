import { Theme, themes } from "@/shared/settings";
import { getThemeColor } from "@/frontend/pages/utils";

export function applyTheme(theme: Theme) {
  themes.forEach((x) => {
    document.documentElement.classList.toggle(x, theme === x);
  });

  // Update status bar theme for PWA
  document.querySelectorAll("meta[name=theme-color]").forEach((meta) => {
    const preferredColorScheme = extractPreferredColorScheme(meta);
    meta.setAttribute("content", getThemeColor(theme, preferredColorScheme));
  });
}

function extractPreferredColorScheme(meta: Element) {
  const media = meta.getAttribute("media");
  return media === "(prefers-color-scheme: light)" ? "light" : "dark";
}
