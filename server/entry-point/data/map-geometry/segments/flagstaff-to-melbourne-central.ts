import {
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";

/** Underground city loop section from Flagstaff to Melbourne Central. */
export function flagstaffToMelbourneCentral(
  lineNumber: loop.LineNumber,
): SegmentInstruction[] {
  const flagstaff = loop.pos.flagstaff(lineNumber);
  const melbourneCentral = loop.pos.melbourneCentral(lineNumber);
  return [straight(flagstaff.horizontalDistanceTo(melbourneCentral))];
}
