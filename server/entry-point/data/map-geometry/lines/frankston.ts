import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { flindersStreetToRichmond } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-richmond";
import {
  defaultRadius,
  east,
  lineGap,
  south,
  standardDiagonal,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  richmondToSouthYarra,
  southYarraToCaulfield,
} from "@/server/entry-point/data/map-geometry/utils-shared-corridors";
import { FRANKSTON as node } from "@/shared/map-node-ids";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import {
  curve,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import { getNodePosition } from "@/server/services/map-geometry/utils";

const aspendaleStraight = flexi(60, 120);
const frankstonStraight = flexi(30, 60);
const loopLine = loop.line.crossCity;

/** The Frankston line (colored green on the map). */
export const frankston = new LineBuilder(
  node.FLINDERS_STREET,
  loop.pos.flindersStreet(loopLine),
  east,
  "green",
)
  .to(node.RICHMOND, flindersStreetToRichmond(loopLine))
  .to(node.SOUTH_YARRA, [straight(richmondToSouthYarra)])
  .to(node.CAULFIELD, [straight(southYarraToCaulfield)])
  .to(node.FRANKSTON, [
    curve(defaultRadius, 45),
    straight(aspendaleStraight),
    curve(defaultRadius, -45),
    straight(standardDiagonal),
    curve(defaultRadius, -45),
    straight(frankstonStraight),
  ]);

export function frankstonStationPos(line: "frankston" | "stony-point") {
  const offset = {
    frankston: 0,
    "stony-point": 1,
  }[line];
  const pos = getNodePosition(frankston, node.FRANKSTON);
  return pos.move(lineGap.times(offset), south);
}
