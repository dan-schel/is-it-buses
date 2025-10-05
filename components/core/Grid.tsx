import React from "react";
import clsx from "clsx";

type GridProps = {
  as?: "div" | "form" | "section" | "main" | "nav" | "header" | "footer";
  children: React.ReactNode;
  className?: string;
  columns?: string;
  rows?: string;
  areas?: string;
  align?: "stretch" | "top" | "center" | "bottom";
  justify?: "stretch" | "left" | "center" | "right";
};

/**
 * Arranges items in a CSS Grid.
 *
 * Rules:
 * - Don't abuse `className` for complex layouts, e.g. media queries.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Grid(props: GridProps) {
  const Tag = props.as ?? "div";

  const align = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
    stretch: "items-stretch",
  }[props.align ?? "stretch"];

  const justify = {
    left: "justify-items-start",
    center: "justify-items-center",
    right: "justify-items-end",
    stretch: "justify-items-stretch",
  }[props.justify ?? "stretch"];

  const areasString = props.areas
    ?.split(",")
    .map((area) => `"${area.trim()}"`)
    .join(" ");

  return (
    <Tag
      className={clsx(`grid`, props.className, align, justify)}
      style={{
        gridTemplateColumns: props.columns,
        gridTemplateRows: props.rows,
        gridTemplateAreas: areasString,
      }}
    >
      {props.children}
    </Tag>
  );
}
