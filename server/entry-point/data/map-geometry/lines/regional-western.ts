import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { northMelbourneToFootscray } from "@/server/entry-point/data/map-geometry/segments/north-melbourne-to-footscray";
import {
  northMelbourneJunctionRrl,
  northMelbourneJunctionSeymour,
  southernCrossToNorthMelbourneJunction,
} from "@/server/entry-point/data/map-geometry/segments/southern-cross-to-north-melbourne";
import {
  defaultRadius,
  northWest,
  standardDiagonal,
} from "@/server/entry-point/data/map-geometry/utils";
import * as loop from "@/server/entry-point/data/map-geometry/utils-city-loop";
import {
  broadmeadowsStraight,
  craigieburnStraight,
  deerParkStraight,
  newmarketCurveSeymour,
  newmarketStraight,
  sunburyStraight,
  sunshineCurvesBendigo,
  sunshineExitDiagonal,
  sunshineJunctionDiagonal,
  sunshineJunctionStraight,
  tottenhamStraight,
  watergardensStraight,
} from "@/server/entry-point/data/map-geometry/utils-shared-corridors";
import { REGIONAL_WESTERN as node } from "@/shared/map-node-ids";
import { LineBuilder } from "@/server/services/map-geometry/line-builder";
import {
  curve,
  straight,
} from "@/server/services/map-geometry/segment-instructions";

const seymourStraight = flexi(50, 100);
const sheppartonStraight = flexi(75, 150);
const avenelStraight = flexi(20, 40);
const alburyStraight = flexi(75, 150);

const kangarooFlatStraight = flexi(30, 60);
const bendigoStraight = flexi(10);
const eaglehawkStraight = flexi(20, 30);
const swanHillStraight = flexi(30, 80);
const echucaStraight = flexi(50, 100);

const ballaratStraight = flexi(40, 80);
const araratStraight = flexi(30, 60);
const maryboroughStraight = flexi(25, 50);
const wyndhamValeStraight = flexi(50, 100);
const warrnamboolStraight = flexi(75, 150);

/**
 * The Ballarat, Bendigo, Geelong, and Seymour lines, which are regional lines
 * (colored purple on the map) that depart Southern Cross toward North
 * Melbourne/Footscray.
 */
export const regionalWestern = new LineBuilder(
  node.SOUTHERN_CROSS,

  // Line does a weird curve near the Southern Cross interchange marker, so its
  // start position is actually the Dandenong group (at a north-west angle).
  loop.pos.southernCross(loop.line.dandenong),
  northWest,

  "purple",
)
  .to(node.NORTH_MELBOURNE_JUNCTION, southernCrossToNorthMelbourneJunction())
  .split((l) =>
    l
      .to(node.NORTH_MELBOURNE_SEYMOUR, northMelbourneJunctionSeymour())

      // TODO: One day we might show the Flemington Racecourse line, and if so,
      // we'll want to add the node for Newmarket here.

      .to(node.BROADMEADOWS, [
        straight(newmarketStraight),
        curve(newmarketCurveSeymour, 45),
        straight(broadmeadowsStraight),
      ])
      .to(node.CRAIGIEBURN, [straight(craigieburnStraight)])
      .to(node.SEYMOUR, [
        curve(defaultRadius, 45),
        straight(standardDiagonal),
        curve(defaultRadius, 45),
        straight(seymourStraight),
      ])
      .split((l) => l.to(node.SHEPPARTON, [straight(sheppartonStraight)]))
      .to(node.ALBURY, [
        curve(defaultRadius, 45),
        straight(avenelStraight),
        curve(defaultRadius, -45),
        straight(alburyStraight),
      ]),
  )
  .to(node.NORTH_MELBOURNE_RRL, northMelbourneJunctionRrl())
  .to(node.FOOTSCRAY, northMelbourneToFootscray("regional-rrl"))
  .to(node.SUNSHINE_JUNCTION, [straight(tottenhamStraight)])
  .split((l) =>
    l
      .to(node.SUNSHINE_BENDIGO, [
        curve(sunshineCurvesBendigo, 45),
        straight(sunshineJunctionDiagonal),
      ])
      .to(node.WATERGARDENS, [
        straight(sunshineExitDiagonal),
        curve(sunshineCurvesBendigo, 45),
        straight(watergardensStraight),
      ])
      .to(node.SUNBURY, [straight(sunburyStraight)])
      .to(node.BENDIGO, [
        straight(kangarooFlatStraight),
        curve(defaultRadius, -45),
        straight(standardDiagonal),
        curve(defaultRadius, -45),
        straight(bendigoStraight),
      ])
      .split((l) => l.to(node.ECHUCA, [straight(echucaStraight)]))
      .to(node.SWAN_HILL, [
        curve(defaultRadius, -45),
        straight(eaglehawkStraight),
        curve(defaultRadius, 45),
        straight(swanHillStraight),
      ]),
  )
  .to(node.SUNSHINE_DEER_PARK, [straight(sunshineJunctionStraight)])
  .to(node.DEER_PARK, [straight(deerParkStraight)])
  .split((l) =>
    l.to(node.WARRNAMBOOL, [
      straight(wyndhamValeStraight),
      curve(defaultRadius, -45),
      straight(standardDiagonal),
      curve(defaultRadius, -45),
      straight(warrnamboolStraight),
    ]),
  )
  .to(node.BALLARAT, [curve(defaultRadius, 45), straight(ballaratStraight)])
  .split((l) => l.to(node.ARARAT, [straight(araratStraight)]))
  .to(node.MARYBOROUGH, [
    curve(defaultRadius, 45),
    straight(maryboroughStraight),
  ]);
