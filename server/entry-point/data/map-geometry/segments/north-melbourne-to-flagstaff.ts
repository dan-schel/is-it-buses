import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { measure45CurveLockedStraight } from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import { northMelbournePos } from "@/server/entry-point/data/map-geometry/segments/southern-cross-to-north-melbourne";

/** The curve from North Melbourne to Flagstaff. */
export function northMelbourneToFlagstaff(): SegmentInstruction[] {
  const flagstaff = loop.pos.flagstaff(loop.line.northern);
  const northMelbourne = northMelbournePos("northern");
  const portalLongLength = northMelbourne.horizontalDistanceTo(flagstaff);
  const portalShortLength = northMelbourne.verticalDistanceTo(flagstaff);

  const {
    diagonalLength: loopNorthMelbourneStraight,
    radius: loopPortalRadius,
  } = measure45CurveLockedStraight(
    portalLongLength,
    portalShortLength,
    flexi(0),
  );

  return [straight(loopNorthMelbourneStraight), curve(loopPortalRadius, -45)];
}
