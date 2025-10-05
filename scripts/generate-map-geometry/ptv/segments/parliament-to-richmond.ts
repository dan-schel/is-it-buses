import { FlexiLength } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { measure45CurveLockedDiagonal } from "@/scripts/generate-map-geometry/ptv/utils";
import * as loop from "@/scripts/generate-map-geometry/ptv/utils-city-loop";
import * as direct from "@/scripts/generate-map-geometry/ptv/segments/flinders-street-to-richmond";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/scripts/generate-map-geometry/lib/segment-instructions";

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
