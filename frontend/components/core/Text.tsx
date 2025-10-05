import React from "react";
import clsx from "clsx";

const sizeScale = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];

const styles = {
  regular: "",
  megatitle: "text-4xl text-foreground-strong",
  title: "text-2xl text-foreground-strong",
  subtitle: "text-xl text-foreground-strong",
  red: "text-status-red",
  green: "text-status-green",

  small: "text-sm",
  "small-green": "text-sm text-status-green",
  "small-yellow": "text-sm text-status-yellow",
  "small-red": "text-sm text-status-red",

  tiny: "text-xs",
  "tiny-inverted": "text-xs text-background",
  "tiny-weak": "text-xs text-foreground-weak",
  "tiny-accent": "text-xs text-accent",
};

type Style =
  | { style?: keyof typeof styles }
  | { style: "custom"; className: string };

type TextProps = {
  children: React.ReactNode;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: "left" | "center" | "right" | "justify";
  oneLine?: boolean;
} & Style;

/**
 * Renders text.
 *
 * Rules:
 * - Do not nest `<Text>` elements.
 * - Never use `className` for margin/padding on `<Text>`.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Text(props: TextProps) {
  const Tag = props.as ?? "span";

  const style =
    props.style === "custom"
      ? props.className
      : styles[props.style ?? "regular"];

  const align = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[props.align ?? "left"];

  if (props.oneLine) {
    const { sizeStyles, otherStyles } = extractTextSizeStyles(style);

    return (
      <div className={clsx("_one-line", sizeStyles)}>
        <Tag className={clsx(otherStyles, align, "_text")}>
          {props.children}
        </Tag>
      </div>
    );
  } else {
    return <Tag className={clsx(style, align, "_text")}>{props.children}</Tag>;
  }
}

function extractTextSizeStyles(className: string) {
  const classes = className.split(" ");
  const sizeStyles: string[] = [];
  const otherStyles: string[] = [];

  for (const c of classes) {
    if (sizeScale.some((s) => c === `text-${s}`) || c.startsWith("text-[")) {
      sizeStyles.push(c);
    } else {
      otherStyles.push(c);
    }
  }

  return {
    sizeStyles: sizeStyles.join(" "),
    otherStyles: otherStyles.join(" "),
  };
}
