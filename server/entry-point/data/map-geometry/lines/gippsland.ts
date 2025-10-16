import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { flindersStreetToRichmond } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-richmond";
import { flindersStreetToSouthernCross } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-southern-cross";
import {
  defaultRadius,
  southEast,
  standardDiagonal,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  caulfieldToClayton,
  claytonToDandenong,
  dandenongToHallamCurve,
  hallamCurveGippland,
  hallamToPakenham,
  pakenhamToEastPakenham,
  richmondToSouthYarra,
  southYarraToCaulfield,
} from "@/server/entry-point/data/map-geometry/utils-shared-corridors";
import { GIPPSLAND as node } from "@/shared/map-node-ids";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import {
  curve,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import { invert } from "@/server/services/map-geometry/utils";

const eastPakenhamCurve = flexi(10, 25);
const bairnsdaleStraight = flexi(60, 120);
const loopLine = loop.line.regional;

/** The Gippsland line (colored purple on the map). */
export const gippsland = new LineBuilder(
  node.SOUTHERN_CROSS,

  // Line does a weird curve near the Southern Cross interchange marker, so its
  // start position is actually the cross-city group (at a south-east angle).
  loop.pos.southernCross(loop.line.crossCity),
  southEast,

  "purple",
)
  .to(node.FLINDERS_STREET, [
    ...invert(flindersStreetToSouthernCross(loopLine, true)),
  ])
  .to(node.RICHMOND, flindersStreetToRichmond(loopLine))
  .to(node.SOUTH_YARRA, [straight(richmondToSouthYarra)])
  .to(node.CAULFIELD, [straight(southYarraToCaulfield)])
  .to(node.CLAYTON, [straight(caulfieldToClayton)])
  .to(node.DANDENONG, [straight(claytonToDandenong)])
  .to(node.PAKENHAM, [
    straight(dandenongToHallamCurve),
    curve(hallamCurveGippland, -45),
    straight(hallamToPakenham),
  ])
  .to(node.EAST_PAKENHAM, [straight(pakenhamToEastPakenham)])
  .to(node.BAIRNSDALE, [
    straight(eastPakenhamCurve),
    curve(defaultRadius, -45),
    straight(standardDiagonal),
    curve(defaultRadius, -45),
    straight(bairnsdaleStraight),
  ]);
