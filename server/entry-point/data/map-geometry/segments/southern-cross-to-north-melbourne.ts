import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import {
  diagonal,
  lineGap,
  long45,
  measure45CurveLockedRadius,
  short45,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import { getEndPoint } from "@/server/services/map-geometry/utils";

const innerRadius = flexi(15);
const loopDirectRadius = flexi(20);
const southernCrossStraight = flexi(30);
const northMelbourneStraight = flexi(10);

/**
 * The direct path from Southern Cross to North Melbourne. Does not include city
 * loop portal or regional line split.
 */
export function southernCrossToNorthMelbourne(
  southernCrossLineNumber: loop.LineNumber,
): SegmentInstruction[] {
  return [
    straight(southernCrossStraight),
    curve(radius(southernCrossLineNumber), -45),
    straight(northMelbourneStraight),
  ];
}

/**
 * The curve from Southern Cross to North Melbourne for the Northern Loop lines.
 */
export function southernCrossToNorthMelbourneNorthernLoop(): SegmentInstruction[] {
  const southernCross = loop.pos.southernCross(loop.line.northern);
  const northMelbourne = northMelbournePos("northern");
  const directLongLength = northMelbourne.verticalDistanceTo(southernCross);
  const directShortLength = northMelbourne.horizontalDistanceTo(southernCross);

  const {
    straightLength: southernCrossStraight,
    diagonalLength: directNorthMelbourneStraight,
  } = measure45CurveLockedRadius(
    directLongLength,
    directShortLength,
    loopDirectRadius,
  );

  return [
    straight(southernCrossStraight),
    curve(loopDirectRadius, -45),
    straight(directNorthMelbourneStraight),
  ];
}

export function southernCrossToNorthMelbourneJunction(): SegmentInstruction[] {
  const curveRadius = lineGap.divide(short45);
  const curveHeight = curveRadius.times(long45);
  const straightLength = southernCrossStraight.minus(curveHeight);

  return [curve(curveRadius, 45), straight(straightLength)];
}

export function northMelbourneJunctionSeymour(): SegmentInstruction[] {
  const branchSouthernCrossStraight = flexi(10).times(diagonal);
  const branchNorthMelbourneStraight = flexi(5);

  return [
    straight(branchSouthernCrossStraight),
    curve(radius(loop.line.regional), -45),
    straight(branchNorthMelbourneStraight),
  ];
}

export function northMelbourneJunctionRrl(): SegmentInstruction[] {
  return [
    curve(radius(loop.line.regional), -45),
    straight(northMelbourneStraight),
  ];
}

export function northMelbournePos(
  track: "newport" | "regional-rrl" | "regional-seymour" | "northern",
): FlexiPoint {
  const southernCrossLineNumber = {
    newport: loop.line.crossCity,
    "regional-rrl": loop.line.regional,
    "regional-seymour": loop.line.dandenong,
    northern: loop.line.burnley,
  }[track];

  return getEndPoint(
    loop.pos.southernCross(southernCrossLineNumber),
    270,
    southernCrossToNorthMelbourne(southernCrossLineNumber),
  );
}

function radius(lineNumber: loop.LineNumber) {
  return innerRadius.plus(lineGap.times(5 - lineNumber));
}
