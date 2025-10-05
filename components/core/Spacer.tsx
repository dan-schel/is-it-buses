import React from "react";

const scale = {
  px: "1px",
  "0": "0",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "44": "11rem",
  "48": "12rem",
  "52": "13rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
};

type SpacerProps = {
  w?: keyof typeof scale;
  h?: keyof typeof scale;
};

/**
 * An invisible gap.
 *
 * Notes:
 * - Units are in the Tailwind spacing scale, i.e. `4 = 1rem`.
 *
 * Rules:
 * - Consider using padding or gap in the parent container if possible.
 *
 * ([More info](https://github.com/dan-schel/is-it-buses/blob/master/docs/ui-conventions.md))
 */
export function Spacer(props: SpacerProps) {
  return (
    <div
      style={{
        width: props.w != null ? scale[props.w] : undefined,
        height: props.h != null ? scale[props.h] : undefined,
      }}
    />
  );
}
