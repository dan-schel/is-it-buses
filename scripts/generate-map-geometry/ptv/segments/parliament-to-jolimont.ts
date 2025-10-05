import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import {
  curve,
  SegmentInstruction,
  straight,
} from "@/scripts/generate-map-geometry/lib/segment-instructions";
import * as loop from "@/scripts/generate-map-geometry/ptv/utils-city-loop";

export const radiusReduction = flexi(5);

/** The curve from Parliament to Jolimont. */
export function parliamentToJolimont(): SegmentInstruction[] {
  const parliamentPos = loop.pos.parliament(loop.line.cliftonHill);
  const flindersStreetPos = loop.pos.flindersStreet(loop.line.cliftonHill);
  const radius = loop.radius(loop.line.cliftonHill).minus(radiusReduction);

  return [
    straight(parliamentPos.verticalDistanceTo(flindersStreetPos).minus(radius)),
    curve(radius, -90),
    curve(radius, -45),
  ];
}
