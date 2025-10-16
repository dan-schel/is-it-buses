import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import {
  curve,
  straight,
  turnBack,
} from "@/server/services/map-geometry/segment-instructions";
import { flagstaffToMelbourneCentral } from "@/server/entry-point/data/map-geometry/segments/flagstaff-to-melbourne-central";
import { flindersStreetToSouthernCross } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-southern-cross";
import { melbourneCentralToParliament } from "@/server/entry-point/data/map-geometry/segments/melbourne-central-to-parliament";
import { northMelbourneToFlagstaff } from "@/server/entry-point/data/map-geometry/segments/north-melbourne-to-flagstaff";
import { northMelbourneToFootscray } from "@/server/entry-point/data/map-geometry/segments/north-melbourne-to-footscray";
import { parliamentToFlindersStreet } from "@/server/entry-point/data/map-geometry/segments/parliament-to-flinders-street";
import { southernCrossToNorthMelbourneNorthernLoop } from "@/server/entry-point/data/map-geometry/segments/southern-cross-to-north-melbourne";
import {
  defaultRadius,
  west,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  broadmeadowsStraight,
  craigieburnStraight,
  newmarketCurveCraigieburn,
  newmarketStraight,
  sunburyStraight,
  sunshineCurvesSunbury,
  sunshineExitDiagonal,
  sunshineJunctionDiagonal,
  tottenhamStraight,
  watergardensStraight,
} from "@/server/entry-point/data/map-geometry/utils-shared-corridors";
import { NORTHERN as node } from "@/shared/map-node-ids";

const upfieldJunctionStraight = flexi(5);
const macaulayStraight = flexi(10);
const brunswickStraight = flexi(30, 60);
const upfieldStraight = flexi(25, 50);
const loopLine = loop.line.northern;

/**
 * The Craigieburn, Sunbury, and Upfield lines, a.k.a. the "Northern group"
 * (colored yellow on the map).
 */
export const northern = new LineBuilder(
  node.FLINDERS_STREET_DIRECT,
  loop.pos.flindersStreet(loopLine),
  west,
  "yellow",
)
  .to(node.SOUTHERN_CROSS, flindersStreetToSouthernCross(loopLine, false))
  .to(node.NORTH_MELBOURNE, southernCrossToNorthMelbourneNorthernLoop())
  .split((l) =>
    l
      .to(node.FLAGSTAFF, [turnBack(), ...northMelbourneToFlagstaff()])
      .to(node.MELBOURNE_CENTRAL, flagstaffToMelbourneCentral(loopLine))
      .to(node.PARLIAMENT, melbourneCentralToParliament(loopLine))
      .to(node.FLINDERS_STREET_LOOP, parliamentToFlindersStreet(loopLine)),
  )
  .split((l) =>
    l.to(node.UPFIELD, [
      straight(upfieldJunctionStraight),
      curve(defaultRadius, 45),
      straight(macaulayStraight),
      curve(defaultRadius, 45),
      straight(brunswickStraight),
      curve(defaultRadius, -45),
      straight(upfieldStraight),
    ]),
  )
  .split((l) =>
    l
      // TODO: One day we might show the Flemington Racecourse line, and if so,
      // we'll want to add the node for Newmarket here.

      .to(node.BROADMEADOWS, [
        straight(newmarketStraight),
        curve(newmarketCurveCraigieburn, 45),
        straight(broadmeadowsStraight),
      ])
      .to(node.CRAIGIEBURN, [straight(craigieburnStraight)]),
  )
  .to(node.FOOTSCRAY, northMelbourneToFootscray("sunbury"))
  .to(node.SUNSHINE_JUNCTION, [straight(tottenhamStraight)])
  .to(node.SUNSHINE, [
    curve(sunshineCurvesSunbury, 45),
    straight(sunshineJunctionDiagonal),
  ])
  .to(node.WATERGARDENS, [
    straight(sunshineExitDiagonal),
    curve(sunshineCurvesSunbury, 45),
    straight(watergardensStraight),
  ])
  .to(node.SUNBURY, [straight(sunburyStraight)]);
