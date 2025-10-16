import {
  curve,
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";

/** Underground city loop section from Melbourne Central to Parliament. */
export function melbourneCentralToParliament(
  lineNumber: loop.LineNumber,
): SegmentInstruction[] {
  const melbourneCentral = loop.pos.melbourneCentral(lineNumber);
  const parliament = loop.pos.parliament(lineNumber);
  const radius = loop.radius(lineNumber);

  return [
    straight(melbourneCentral.horizontalDistanceTo(parliament).minus(radius)),
    curve(radius, 90),
    straight(parliament.verticalDistanceTo(melbourneCentral).minus(radius)),
  ];
}
