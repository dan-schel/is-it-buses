import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { fp } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import { lineGap } from "@/server/entry-point/data/map-geometry/utils";

const innerRadius = flexi(15);

const southEdgeY = 0;
const westEdgeX = -55;
const northEdgeY = -60;
const eastEdgeX = 35;

const flindersStreetX = 0;
const southernCrossY = -30;
const flagstaffX = -40;
const melbourneCentralX = 0;
const parliamentY = -45;

export const line = {
  northern: 0,
  cliftonHill: 1,
  burnley: 2,
  dandenong: 3,
  regional: 4,
  crossCity: 5,
  sandringham: 6,
} as const;

export type LineNumber = (typeof line)[keyof typeof line];

/** The radius to use, based on the line number index from the center. */
export function radius(lineNumber: LineNumber) {
  return innerRadius.plus(lineGap.times(lineNumber));
}

export const pos = {
  /**
   * The position of Flinders Street, based on the line number index from the
   * center.
   */
  flindersStreet: (lineNumber: LineNumber) =>
    fp([flindersStreetX, southEdgeY]).plus({ y: lineGap.times(lineNumber) }),

  /**
   * The position of Southern Cross, based on the line number index from the
   * center.
   */
  southernCross: (lineNumber: LineNumber) =>
    fp([westEdgeX, southernCrossY]).minus({ x: lineGap.times(lineNumber) }),

  /** The position of Flagstaff, based on the line number index from the center. */
  flagstaff: (lineNumber: LineNumber) =>
    fp([flagstaffX, northEdgeY]).minus({ y: lineGap.times(lineNumber) }),

  /**
   * The position of Melbourne Central, based on the line number index from the
   * center.
   */
  melbourneCentral: (lineNumber: LineNumber) =>
    fp([melbourneCentralX, northEdgeY]).minus({ y: lineGap.times(lineNumber) }),

  /** The position of Parliament, based on the line number index from the center. */
  parliament: (lineNumber: LineNumber) =>
    fp([eastEdgeX, parliamentY]).plus({ x: lineGap.times(lineNumber) }),
};
