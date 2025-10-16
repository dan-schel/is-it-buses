import { FlexiLength } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { measure45CurveLockedDiagonal } from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import * as direct from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-richmond";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";

/** The curve from Parliament to Richmond. */
export function parliamentToRichmond(
  lineNumber: loop.LineNumber,
  portalStraight: FlexiLength,
): SegmentInstruction[] {
  const parliamentPos = loop.pos.parliament(lineNumber);
  const richmondPos = direct.richmondPos(lineNumber);
  const longLength = parliamentPos.verticalDistanceTo(richmondPos);
  const shortLength = parliamentPos.horizontalDistanceTo(richmondPos);
  const { straightLength, radius } = measure45CurveLockedDiagonal(
    longLength,
    shortLength,
    portalStraight,
  );

  return [
    straight(straightLength),
    curve(radius, -45),
    straight(portalStraight),
  ];
}
