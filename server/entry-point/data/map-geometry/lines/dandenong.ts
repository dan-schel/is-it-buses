import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import {
  curve,
  straight,
  turnBack,
} from "@/server/services/map-geometry/segment-instructions";
import { invert } from "@/server/services/map-geometry/utils";
import { flagstaffToMelbourneCentral } from "@/server/entry-point/data/map-geometry/segments/flagstaff-to-melbourne-central";
import { flindersStreetToRichmond } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-richmond";
import { flindersStreetToSouthernCross } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-southern-cross";
import { melbourneCentralToParliament } from "@/server/entry-point/data/map-geometry/segments/melbourne-central-to-parliament";
import { parliamentToRichmond } from "@/server/entry-point/data/map-geometry/segments/parliament-to-richmond";
import { southernCrossToFlagstaff } from "@/server/entry-point/data/map-geometry/segments/southern-cross-to-flagstaff";
import {
  defaultRadius,
  west,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  caulfieldToClayton,
  claytonToDandenong,
  dandenongToHallamCurve,
  hallamCurvePakenham,
  hallamToPakenham,
  pakenhamToEastPakenham,
  richmondToSouthYarra,
  southYarraToCaulfield,
} from "@/server/entry-point/data/map-geometry/utils-shared-corridors";
import { DANDENONG as node } from "@/shared/map-node-ids";

const loopPortalStraight = flexi(10);
const cranbourneStraight = flexi(30, 45);
const loopLine = loop.line.dandenong;

/**
 * The Cranbourne and Pakenham lines, a.k.a. the "Dandenong group" (colored
 * light blue/cyan on the map).
 */
export const dandenong = new LineBuilder(
  node.FLINDERS_STREET_LOOP,
  loop.pos.flindersStreet(loopLine),
  west,
  "cyan",
)
  .to(node.SOUTHERN_CROSS, flindersStreetToSouthernCross(loopLine, false))
  .to(node.FLAGSTAFF, southernCrossToFlagstaff(loopLine))
  .to(node.MELBOURNE_CENTRAL, flagstaffToMelbourneCentral(loopLine))
  .to(node.PARLIAMENT, melbourneCentralToParliament(loopLine))
  .to(node.RICHMOND, parliamentToRichmond(loopLine, loopPortalStraight))
  .split((l) =>
    l.to(node.FLINDERS_STREET_DIRECT, [
      turnBack(),
      ...invert(flindersStreetToRichmond(loopLine)),
    ]),
  )
  .to(node.SOUTH_YARRA, [straight(richmondToSouthYarra)])
  .to(node.CAULFIELD, [straight(southYarraToCaulfield)])
  .to(node.CLAYTON, [straight(caulfieldToClayton)])
  .to(node.DANDENONG, [straight(claytonToDandenong)])
  .split((l) =>
    l.to(node.CRANBOURNE, [
      curve(defaultRadius, 45),
      straight(cranbourneStraight),
    ]),
  )
  .to(node.PAKENHAM, [
    straight(dandenongToHallamCurve),
    curve(hallamCurvePakenham, -45),
    straight(hallamToPakenham),
  ])
  .to(node.EAST_PAKENHAM, [straight(pakenhamToEastPakenham)]);
