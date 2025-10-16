import {
  curve,
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import {
  lineGap,
  long45,
  short45,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";

/** South-west corner of the city loop from Flinders Street to Southern Cross. */
export function flindersStreetToSouthernCross(
  lineNumber: loop.LineNumber,
  curveEnd: boolean,
): SegmentInstruction[] {
  const fss = loop.pos.flindersStreet(lineNumber);
  const scs = loop.pos.southernCross(lineNumber);
  const radius = loop.radius(lineNumber);
  const straight1 = fss.horizontalDistanceTo(scs).minus(radius);
  const straight2 = scs.verticalDistanceTo(fss).minus(radius);

  if (curveEnd) {
    const curveRadius = lineGap.divide(short45);
    const curveHeight = curveRadius.times(long45);
    return [
      straight(straight1),
      curve(radius, 90),
      straight(straight2.minus(curveHeight)),
      curve(curveRadius, -45),
    ];
  } else {
    return [straight(straight1), curve(radius, 90), straight(straight2)];
  }
}
