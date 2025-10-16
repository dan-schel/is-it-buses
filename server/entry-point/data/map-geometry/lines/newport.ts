import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import {
  curve,
  straight,
} from "@/server/services/map-geometry/segment-instructions";
import { flindersStreetToSouthernCross } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-southern-cross";
import { northMelbourneToFootscray } from "@/server/entry-point/data/map-geometry/segments/north-melbourne-to-footscray";
import { southernCrossToNorthMelbourne } from "@/server/entry-point/data/map-geometry/segments/southern-cross-to-north-melbourne";
import {
  defaultRadius,
  diagonal,
  west,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import { NEWPORT as node } from "@/shared/map-node-ids";

const newportStraight = flexi(40, 80);
const williamstownStraight = flexi(30, 40);
const westonaStraight = flexi(10, 30);
const altonaLoopDiagonals = flexi(20, 30);
const lavertonExpressStraight = westonaStraight.plus(
  altonaLoopDiagonals.times(diagonal).times(2),
);
const werribeeStraight = flexi(25, 50);
const loopLine = loop.line.crossCity;

/**
 * The Werribee and Williamstown lines, which split from each other at Newport
 * (colored green on the map).
 */
export const newport = new LineBuilder(
  node.FLINDERS_STREET,
  loop.pos.flindersStreet(loopLine),
  west,
  "green",
)
  .to(node.SOUTHERN_CROSS, flindersStreetToSouthernCross(loopLine, false))
  .to(node.NORTH_MELBOURNE, southernCrossToNorthMelbourne(loopLine))
  .to(node.FOOTSCRAY, northMelbourneToFootscray("newport"))
  .to(node.NEWPORT, [curve(defaultRadius, -45), straight(newportStraight)])
  .split((l) =>
    l.to(node.WILLIAMSTOWN, [
      curve(defaultRadius, -45),
      straight(williamstownStraight),
    ]),
  )
  .split((l) =>
    l.to(node.LAVERTON_EXPRESS, [
      curve(defaultRadius, 45),
      straight(lavertonExpressStraight),
      curve(defaultRadius, 45),
    ]),
  )
  .to(node.LAVERTON_LOOP, [
    straight(altonaLoopDiagonals),
    curve(defaultRadius, 45),
    straight(westonaStraight),
    curve(defaultRadius, 45),
    straight(altonaLoopDiagonals),
  ])
  .to(node.WERRIBEE, [straight(werribeeStraight)]);
