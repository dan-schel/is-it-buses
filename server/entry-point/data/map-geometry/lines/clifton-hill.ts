import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import {
  curve,
  straight,
  turnBack,
} from "@/server/services/map-geometry/segment-instructions";
import { flagstaffToMelbourneCentral } from "@/server/entry-point/data/map-geometry/segments/flagstaff-to-melbourne-central";
import { flindersStreetToSouthernCross } from "@/server/entry-point/data/map-geometry/segments/flinders-street-to-southern-cross";
import { jolimontToFlindersStreet } from "@/server/entry-point/data/map-geometry/segments/jolimont-to-flinders-street";
import { melbourneCentralToParliament } from "@/server/entry-point/data/map-geometry/segments/melbourne-central-to-parliament";
import { parliamentToJolimont } from "@/server/entry-point/data/map-geometry/segments/parliament-to-jolimont";
import { southernCrossToFlagstaff } from "@/server/entry-point/data/map-geometry/segments/southern-cross-to-flagstaff";
import {
  defaultRadius,
  standardDiagonal,
  west,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import { CLIFTON_HILL as node } from "@/shared/map-node-ids";

const cliftonHillStraight = flexi(40, 80);
const heidelbergStraight = flexi(40, 80);
const hurstbridgeStraight = flexi(50, 100);
const prestonStraight = flexi(40, 80);
const merndaStraight = flexi(50, 100);

const loopLine = loop.line.cliftonHill;

/**
 * The Hurstbridge and Mernda lines, a.k.a. the "Clifton Hill group" (colored
 * red on the map).
 */
export const cliftonHill = new LineBuilder(
  node.FLINDERS_STREET_LOOP,
  loop.pos.flindersStreet(loop.line.cliftonHill),
  west,
  "red",
)
  .to(node.SOUTHERN_CROSS, flindersStreetToSouthernCross(loopLine, false))
  .to(node.FLAGSTAFF, southernCrossToFlagstaff(loopLine))
  .to(node.MELBOURNE_CENTRAL, flagstaffToMelbourneCentral(loopLine))
  .to(node.PARLIAMENT, melbourneCentralToParliament(loopLine))
  .to(node.JOLIMONT, parliamentToJolimont())
  .split((l) =>
    l.to(node.FLINDERS_STREET_DIRECT, [
      turnBack(),
      ...jolimontToFlindersStreet(),
    ]),
  )
  .to(node.CLIFTON_HILL, [straight(cliftonHillStraight)])
  .split((l) =>
    l.to(node.HURSTBRIDGE, [
      straight(heidelbergStraight),
      curve(defaultRadius, 45),
      straight(hurstbridgeStraight),
    ]),
  )
  .to(node.MERNDA, [
    curve(defaultRadius, -45),
    straight(prestonStraight),
    curve(defaultRadius, 45),
    straight(standardDiagonal),
    curve(defaultRadius, 45),
    straight(merndaStraight),
  ]);
