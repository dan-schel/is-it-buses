import React from "react";
import clsx from "clsx";

export type RowProps = {
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
  align?: "stretch" | "top" | "center" | "bottom";
  justify?: "left" | "center" | "right" | "space-between";
  wrap?: boolean;
};

/**
 * Arranges items in a CSS Flexbox row.
 *
 * Rules:
 * - Don't abuse `className` for complex layouts, e.g. media queries.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Row(props: RowProps) {
  const Tag = props.as ?? "div";

  const align = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
    stretch: "items-stretch",
  }[props.align ?? "stretch"];

  const justify = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    "space-between": "justify-between",
  }[props.justify ?? "left"];

  return (
    <Tag
      className={clsx(
        "flex flex-row",
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
