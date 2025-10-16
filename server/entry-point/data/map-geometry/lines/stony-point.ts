import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { STONY_POINT as node } from "@/shared/map-node-ids";
import { frankstonStationPos } from "@/server/entry-point/data/map-geometry/lines/frankston";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import { straight } from "@/server/services/map-geometry/segment-instructions";
import { east } from "@/server/entry-point/data/map-geometry/utils";

const stonyPointStraight = flexi(50, 100);

/** The Stony Point line (colored green on the map). */
export const stonyPoint = new LineBuilder(
  node.FRANKSTON,
  frankstonStationPos("stony-point"),
  east,
  "green",
).to(node.STONY_POINT, [straight(stonyPointStraight)]);
