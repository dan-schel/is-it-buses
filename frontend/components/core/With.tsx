import React from "react";
import clsx from "clsx";

type WithProps = {
  children: React.ReactElement;
  className?: string;
  flexGrow?: string;
  gridColumn?: string | number;
  gridRow?: string | number;
  gridArea?: string;
};

/**
 * Applies additional layout props to the inner element.
 *
 * Rules:
 * - Great for setting flex grow, or grid columns/row/area.
 * - This is a last resort for setting margin. Consider alternatives.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function With(props: WithProps) {
  const child = React.Children.only(props.children);

  // For some reason, setting gridArea (even to undefined) breaks the layout...
  // sometimes. (When the page is refreshed it's fine, but when initially
  // navigated to it breaks. Is SSR vs CSR is causing the difference?)
  const gridStyle = props.gridArea
    ? { gridArea: props.gridArea }
    : { gridColumn: props.gridColumn, gridRow: props.gridRow };

  return (
    <div
      className={clsx("grid", props.className)}
      style={{
        flexGrow: props.flexGrow,
        ...gridStyle,
      }}
    >
      {child}
    </div>
  );
}
