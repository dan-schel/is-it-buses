import React from "react";
import clsx from "clsx";

export type ColumnProps = {
  as?:
    | "div"
    | "form"
    | "section"
    | "main"
    | "nav"
    | "header"
    | "footer"
    | "label";
  children: React.ReactNode;
  className?: string;
  align?: "stretch" | "left" | "center" | "right";
  justify?: "top" | "center" | "bottom" | "space-between";
  wrap?: boolean;
};

/**
 * Arranges items in a CSS Flexbox column.
 *
 * Rules:
 * - Don't abuse `className` for complex layouts, e.g. media queries.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Column(props: ColumnProps) {
  const Tag = props.as ?? "div";

  const align = {
    left: "items-start",
    center: "items-center",
    right: "items-end",
    stretch: "items-stretch",
  }[props.align ?? "stretch"];

  const justify = {
    top: "justify-start",
    center: "justify-center",
    bottom: "justify-end",
    "space-between": "justify-between",
  }[props.justify ?? "top"];

  return (
    <Tag
      className={clsx(
        "flex flex-col",
        justify,
        align,
        { "flex-wrap": props.wrap },
        props.className,
      )}
    >
      {props.children}
    </Tag>
  );
}
