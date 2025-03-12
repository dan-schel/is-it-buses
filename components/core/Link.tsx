import React from "react";
import { Action } from "@/components/core/Button";

export type LinkProps = {
  children: React.ReactNode;
} & Action;

/**
 * Clickable inline underlined text.
 *
 * Rules:
 * - Use inside a `<Text>` element.
 * - `<Button>` supports `href`, so only use this if you want the underlined
 *   text.
 *
 * ([More info](https://github.com/dan-schel/train-disruptions/blob/master/docs/ui-conventions.md))
 */
export function Link(props: LinkProps) {
  if (props.href != null) {
    return (
      <a
        className="inline text-blue-700 underline"
        href={props.href}
        target={props.target}
      >
        {props.children}
      </a>
    );
  } else {
    // Using <a> instead of <span> (doesn't support tab navigation) and <button>
    // (doesn't do text wrapping or highlighting).
    return (
      <a
        className="inline text-blue-700 underline"
        href="#"
        onClick={props.onClick}
      >
        {props.children}
      </a>
    );
  }
}
