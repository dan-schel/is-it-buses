import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import { radiusReduction } from "@/server/entry-point/data/map-geometry/segments/parliament-to-jolimont";

/** The curve from Jolimont to Flinders Street. */
export function jolimontToFlindersStreet(): SegmentInstruction[] {
  const parliamentPos = loop.pos.parliament(loop.line.cliftonHill);
  const flindersStreetPos = loop.pos.flindersStreet(loop.line.cliftonHill);
  const radius = loop.radius(loop.line.cliftonHill).minus(radiusReduction);

  return [
    curve(radius, 45),
    straight(
      parliamentPos.horizontalDistanceTo(flindersStreetPos).plus(radius),
    ),
  ];
}
