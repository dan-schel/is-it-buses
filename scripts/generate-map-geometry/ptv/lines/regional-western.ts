import { flexi } from "@/frontend/components/map/renderer/dimensions/flexi-length";
import { northMelbourneToFootscray } from "@/scripts/generate-map-geometry/ptv/segments/north-melbourne-to-footscray";
import {
  northMelbourneJunctionRrl,
  northMelbourneJunctionSeymour,
  southernCrossToNorthMelbourneJunction,
} from "@/scripts/generate-map-geometry/ptv/segments/southern-cross-to-north-melbourne";
import {
  defaultRadius,
  northWest,
  standardDiagonal,
} from "@/scripts/generate-map-geometry/ptv/utils";
import * as loop from "@/scripts/generate-map-geometry/ptv/utils-city-loop";
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
} from "@/scripts/generate-map-geometry/ptv/utils-shared-corridors";
import { REGIONAL_WESTERN as node } from "@/shared/map-node-ids";
import { LineBuilder } from "@/scripts/generate-map-geometry/lib/line-builder";
import {
  curve,
  straight,
} from "@/scripts/generate-map-geometry/lib/segment-instructions";

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
