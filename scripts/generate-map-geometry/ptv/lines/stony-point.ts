import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { STONY_POINT as node } from "@/shared/map-node-ids";
import { frankstonStationPos } from "@/scripts/generate-map-geometry/ptv/lines/frankston";
import { LineBuilder } from "@/scripts/generate-map-geometry/lib/line-builder";
import { straight } from "@/scripts/generate-map-geometry/lib/segment-instructions";
import { east } from "@/scripts/generate-map-geometry/ptv/utils";

const stonyPointStraight = flexi(50, 100);

/** The Stony Point line (colored green on the map). */
export const stonyPoint = new LineBuilder(
  node.FRANKSTON,
  frankstonStationPos("stony-point"),
  east,
  "green",
).to(node.STONY_POINT, [straight(stonyPointStraight)]);
