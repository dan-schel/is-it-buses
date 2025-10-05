import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { LineBuilder } from "@/scripts/generate-map-geometry/lib/line-builder";
import {
  curve,
  straight,
} from "@/scripts/generate-map-geometry/lib/segment-instructions";
import { flindersStreetToRichmond } from "@/scripts/generate-map-geometry/ptv/segments/flinders-street-to-richmond";
import { defaultRadius, east } from "@/scripts/generate-map-geometry/ptv/utils";
import * as loop from "@/scripts/generate-map-geometry/ptv/utils-city-loop";
import { richmondToSouthYarra } from "@/scripts/generate-map-geometry/ptv/utils-shared-corridors";
import { SANDRINGHAM as node } from "@/shared/map-node-ids";

const divergeStraight = flexi(10);
const diagonalStraight = flexi(10, 20);
const sandringhamStraight = flexi(40, 80);

/** The Sandringham line (colored pink on the map). */
export const sandringham = new LineBuilder(
  node.FLINDERS_STREET,
  loop.pos.flindersStreet(loop.line.sandringham),
  east,
  "pink",
)
  .to(node.RICHMOND, flindersStreetToRichmond(loop.line.sandringham))
  .to(node.SOUTH_YARRA, [straight(richmondToSouthYarra)])
  .to(node.SANDRINGHAM, [
    curve(defaultRadius, 45),
    straight(divergeStraight),
    curve(defaultRadius, 45),
    straight(diagonalStraight),
    curve(defaultRadius, -45),
    straight(sandringhamStraight),
  ]);
