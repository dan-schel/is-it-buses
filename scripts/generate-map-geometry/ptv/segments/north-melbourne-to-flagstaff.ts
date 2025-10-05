import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { measure45CurveLockedStraight } from "@/scripts/generate-map-geometry/ptv/utils";
import * as loop from "@/scripts/generate-map-geometry/ptv/utils-city-loop";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/scripts/generate-map-geometry/lib/segment-instructions";
import { northMelbournePos } from "@/scripts/generate-map-geometry/ptv/segments/southern-cross-to-north-melbourne";

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
