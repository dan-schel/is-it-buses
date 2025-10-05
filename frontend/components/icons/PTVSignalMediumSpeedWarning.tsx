import React from "react";
import type { SVGProps } from "react";

// Stop Signal Diagram used by trains in Victoria
// https://www.victorianrailways.net/signaling/3pos.html#:~:text=R/R-,Stop,-%22On%20the%20red
export function PTVSignalMediumSpeedWarning(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect
        x="8"
        y="4.5"
        width="8"
        height="15"
        rx="4.5"
        fill="var(--color-interchange-stroke)"
        stroke="var(--color-foreground)"
      />
      <circle cx="12" cy="8.5" r="2" fill="var(--color-status-red)" />
      <circle cx="12" cy="15.5" r="2" fill="var(--color-status-yellow)" />
    </svg>
  );
}
