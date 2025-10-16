import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { FlexiPoint } from "@/frontend/components/map/renderer/dimensions/flexi-point";
import {
  defaultRadius,
  lineGap,
  measure45CurveLockedDiagonal,
  north,
  northWest,
} from "@/server/entry-point/data/map-geometry/utils";
import { northMelbournePos } from "@/server/entry-point/data/map-geometry/segments/southern-cross-to-north-melbourne";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import { getEndPoint } from "@/server/services/map-geometry/utils";

const northMelbourneStraight = flexi(10);
const northMelbourneStraightSunbury = flexi(5);
const footscrayStraight = flexi(30);

/** The curves from North Melbourne to Footscray. */
export function northMelbourneToFootscray(
  track: "newport" | "regional-rrl" | "sunbury",
): SegmentInstruction[] {
  if (track === "sunbury") {
    const northMelbourne = northMelbournePos("northern");
    const footscray = footscrayPosFunc("sunbury");

    const longLength = northMelbourne.horizontalDistanceTo(footscray);
    const shortLength = northMelbourne.verticalDistanceTo(footscray);
    const { straightLength, radius } = measure45CurveLockedDiagonal(
      longLength,
      shortLength,
      northMelbourneStraightSunbury,
    );

    return [
      straight(northMelbourneStraightSunbury),
      curve(radius, -45),
      straight(straightLength),
    ];
  } else {
    return [
      straight(northMelbourneStraight),
      curve(radius(track), -45),
      straight(footscrayStraight),
    ];
  }
}

function radius(track: "newport" | "regional-rrl") {
  return track === "newport" ? defaultRadius : defaultRadius.plus(lineGap);
}

function footscrayPosFunc(
  track: "newport" | "regional-rrl" | "sunbury",
): FlexiPoint {
  const trackNumber = {
    newport: 0,
    "regional-rrl": 1,
    sunbury: 2,
  }[track];

  return getEndPoint(
    northMelbournePos("newport"),
    northWest,
    northMelbourneToFootscray("newport"),
  ).move(lineGap.times(trackNumber), north);
}
