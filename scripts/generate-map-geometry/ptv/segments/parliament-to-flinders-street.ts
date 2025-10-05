import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/scripts/generate-map-geometry/lib/segment-instructions";
import * as loop from "@/scripts/generate-map-geometry/ptv/utils-city-loop";

const radiusReduction = flexi(5);

/**
 * South-east corner of the city loop from Parliament to Flinders Street. Does
 * not include portals to Richmond or Jolimont.
 */
export function parliamentToFlindersStreet(
  lineNumber: loop.LineNumber,
): SegmentInstruction[] {
  const parliament = loop.pos.parliament(lineNumber);
  const flindersStreet = loop.pos.flindersStreet(lineNumber);
  const radius = loop.radius(lineNumber).minus(radiusReduction);

  return [
    straight(parliament.verticalDistanceTo(flindersStreet).minus(radius)),
    curve(radius, 90),
    straight(parliament.horizontalDistanceTo(flindersStreet).minus(radius)),
  ];
}
