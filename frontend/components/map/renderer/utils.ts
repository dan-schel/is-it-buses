export const lineWidth = 4;
export const interchangeThinLineWidth = 1;
export const interchangeThickLineWidth = 4;
export const interchangeBorderWidth = 1;
export const terminusLineWidth = 3;
export const iconRadius = 8;
export const iconStrokeWidth = 1;

export const viewportPadding = 5;

export const lineColors = [
  "red",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "grey",
] as const;

export type LineColor = (typeof lineColors)[number];

export type MapColor =
  | LineColor
  | "interchange-stroke"
  | "interchange-fill"
  | "ghost-line"
  | "foreground-strong"
  | "on-foreground";

export type MapCssColors = Record<MapColor, string>;

export function getColors(): MapCssColors {
  const css = window.getComputedStyle(document.body);

  return {
    red: css.getPropertyValue("--color-ptv-red"),
    yellow: css.getPropertyValue("--color-ptv-yellow"),
    green: css.getPropertyValue("--color-ptv-green"),
    cyan: css.getPropertyValue("--color-ptv-cyan"),
    blue: css.getPropertyValue("--color-ptv-blue"),
    purple: css.getPropertyValue("--color-ptv-purple"),
    pink: css.getPropertyValue("--color-ptv-pink"),
    grey: css.getPropertyValue("--color-switch"),
    "interchange-fill": css.getPropertyValue("--color-interchange-fill"),
    "interchange-stroke": css.getPropertyValue("--color-interchange-stroke"),
    "ghost-line": css.getPropertyValue("--color-soft-border"),
    "foreground-strong": css.getPropertyValue("--color-foreground-strong"),
    "on-foreground": css.getPropertyValue("--color-background"),
  };
}
