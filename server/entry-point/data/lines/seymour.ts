import * as id from "@/shared/line-ids";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import * as group from "@/server/entry-point/data/groups";
import { Line } from "@/server/data/line/line";
import { StationPair } from "@/server/data/line/line-routes/station-pair";
import {
  LineShape,
  LineShapeEdge,
} from "@/server/data/line/line-routes/line-shape";
import { LineRoute } from "@/server/data/line/line-routes/line-route";
import { MapSegment } from "@/server/data/map-segment";

// prettier-ignore
const routeGraph = {
  southernCrossToDonnybrook: new StationPair(station.SOUTHERN_CROSS, station.DONNYBROOK),
  northMelbourneToDonnybrook: new StationPair(station.NORTH_MELBOURNE, station.DONNYBROOK),
  broadmeadowsToDonnybrook: new StationPair(station.BROADMEADOWS, station.DONNYBROOK),
  craigieburnToDonnybrook: new StationPair(station.CRAIGIEBURN, station.DONNYBROOK),
  donnybrookToWallan: new StationPair(station.DONNYBROOK, station.WALLAN),
  wallanToHeathcoteJunction: new StationPair(station.WALLAN, station.HEATHCOTE_JUNCTION),
  heathcoteJunctionToWandong: new StationPair(station.HEATHCOTE_JUNCTION, station.WANDONG),
  wandongToKilmoreEast: new StationPair(station.WANDONG, station.KILMORE_EAST),
  kilmoreEastToBroadford: new StationPair(station.KILMORE_EAST, station.BROADFORD),
  broadfordToTallarook: new StationPair(station.BROADFORD, station.TALLAROOK),
  tallarookToSeymour: new StationPair(station.TALLAROOK, station.SEYMOUR),
  seymourToAvenel: new StationPair(station.SEYMOUR, station.AVENEL),
  avenelToEuroa: new StationPair(station.AVENEL, station.EUROA),
  euroaToVioletTown: new StationPair(station.EUROA, station.VIOLET_TOWN),
  violetTownToBenalla: new StationPair(station.VIOLET_TOWN, station.BENALLA),
  benallaToWangaratta: new StationPair(station.BENALLA, station.WANGARATTA),
  wangarattaToSpringhurst: new StationPair(station.WANGARATTA, station.SPRINGHURST),
  springhurstToChiltern: new StationPair(station.SPRINGHURST, station.CHILTERN),
  chilternToWodonga: new StationPair(station.CHILTERN, station.WODONGA),
  wodongaToAlbury: new StationPair(station.WODONGA, station.ALBURY),
  seymourToNagambie: new StationPair(station.SEYMOUR, station.NAGAMBIE),
  nagambieToMurchisonEast: new StationPair(station.NAGAMBIE, station.MURCHISON_EAST),
  murchisonEastToMooroopna: new StationPair(station.MURCHISON_EAST, station.MOOROOPNA),
  mooroopnaToShepparton: new StationPair(station.MOOROOPNA, station.SHEPPARTON),
};

// prettier-ignore
const mapSegment = {
  southernCrossToNorthMelbourneJunction: MapSegment.full(map.REGIONAL_WESTERN.SOUTHERN_CROSS, map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION),
  northMelbourneJunctionToNorthMelbourne: MapSegment.full(map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION, map.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR),
  northMelbourneToBroadmeadows: MapSegment.full(map.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR, map.REGIONAL_WESTERN.BROADMEADOWS),
  broadmeadowsToCraigieburn: MapSegment.full(map.REGIONAL_WESTERN.BROADMEADOWS, map.REGIONAL_WESTERN.CRAIGIEBURN),
  craigieburnToSeymour: MapSegment.full(map.REGIONAL_WESTERN.CRAIGIEBURN, map.REGIONAL_WESTERN.SEYMOUR),
  seymourToAlbury: MapSegment.full(map.REGIONAL_WESTERN.SEYMOUR, map.REGIONAL_WESTERN.ALBURY),
  seymourToShepparton: MapSegment.full(map.REGIONAL_WESTERN.SEYMOUR, map.REGIONAL_WESTERN.SHEPPARTON),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE, [
    routeGraph.southernCrossToDonnybrook,
  ], [
    mapSegment.southernCrossToNorthMelbourneJunction,
    mapSegment.northMelbourneJunctionToNorthMelbourne,
  ]),
  new LineShapeEdge(station.NORTH_MELBOURNE, station.BROADMEADOWS, [
    routeGraph.southernCrossToDonnybrook,
    routeGraph.northMelbourneToDonnybrook,
  ], [
    mapSegment.northMelbourneToBroadmeadows,
  ]),
  new LineShapeEdge(station.BROADMEADOWS, station.CRAIGIEBURN, [
    routeGraph.southernCrossToDonnybrook,
    routeGraph.northMelbourneToDonnybrook,
    routeGraph.broadmeadowsToDonnybrook,
  ], [
    mapSegment.broadmeadowsToCraigieburn,
  ]),
  new LineShapeEdge(station.CRAIGIEBURN, station.DONNYBROOK, [
    routeGraph.southernCrossToDonnybrook,
    routeGraph.northMelbourneToDonnybrook,
    routeGraph.broadmeadowsToDonnybrook,
    routeGraph.craigieburnToDonnybrook,
  ], [
    mapSegment.craigieburnToSeymour.part(1, 8),
  ]),
  new LineShapeEdge(station.DONNYBROOK, station.WALLAN, [
    routeGraph.donnybrookToWallan,
  ], [
    mapSegment.craigieburnToSeymour.part(2, 8),
  ]),
  new LineShapeEdge(station.WALLAN, station.HEATHCOTE_JUNCTION, [
    routeGraph.wallanToHeathcoteJunction,
  ], [
    mapSegment.craigieburnToSeymour.part(3, 8),
  ]),
  new LineShapeEdge(station.HEATHCOTE_JUNCTION, station.WANDONG, [
    routeGraph.heathcoteJunctionToWandong,
  ], [
    mapSegment.craigieburnToSeymour.part(4, 8),
  ]),
  new LineShapeEdge(station.WANDONG, station.KILMORE_EAST, [
    routeGraph.wandongToKilmoreEast,
  ], [
    mapSegment.craigieburnToSeymour.part(5, 8),
  ]),
  new LineShapeEdge(station.KILMORE_EAST, station.BROADFORD, [
    routeGraph.kilmoreEastToBroadford,
  ], [
    mapSegment.craigieburnToSeymour.part(6, 8),
  ]),
  new LineShapeEdge(station.BROADFORD, station.TALLAROOK, [
    routeGraph.broadfordToTallarook,
  ], [
    mapSegment.craigieburnToSeymour.part(7, 8),
  ]),
  new LineShapeEdge(station.TALLAROOK, station.SEYMOUR, [
    routeGraph.tallarookToSeymour,
  ], [
    mapSegment.craigieburnToSeymour.part(8, 8),
  ]),
  new LineShapeEdge(station.SEYMOUR, station.AVENEL, [
    routeGraph.seymourToAvenel,
  ], [
    mapSegment.seymourToAlbury.part(1, 9),
  ]),
  new LineShapeEdge(station.AVENEL, station.EUROA, [
    routeGraph.avenelToEuroa,
  ], [
    mapSegment.seymourToAlbury.part(2, 9),
  ]),
  new LineShapeEdge(station.EUROA, station.VIOLET_TOWN, [
    routeGraph.euroaToVioletTown,
  ], [
    mapSegment.seymourToAlbury.part(3, 9),
  ]),
  new LineShapeEdge(station.VIOLET_TOWN, station.BENALLA, [
    routeGraph.violetTownToBenalla,
  ], [
    mapSegment.seymourToAlbury.part(4, 9),
  ]),
  new LineShapeEdge(station.BENALLA, station.WANGARATTA, [
    routeGraph.benallaToWangaratta,
  ], [
    mapSegment.seymourToAlbury.part(5, 9),
  ]),
  new LineShapeEdge(station.WANGARATTA, station.SPRINGHURST, [
    routeGraph.wangarattaToSpringhurst,
  ], [
    mapSegment.seymourToAlbury.part(6, 9),
  ]),
  new LineShapeEdge(station.SPRINGHURST, station.CHILTERN, [
    routeGraph.springhurstToChiltern,
  ], [
    mapSegment.seymourToAlbury.part(7, 9),
  ]),
  new LineShapeEdge(station.CHILTERN, station.WODONGA, [
    routeGraph.chilternToWodonga,
  ], [
    mapSegment.seymourToAlbury.part(8, 9),
  ]),
  new LineShapeEdge(station.WODONGA, station.ALBURY, [
    routeGraph.wodongaToAlbury,
  ], [
    mapSegment.seymourToAlbury.part(9, 9),
  ]),
  new LineShapeEdge(station.SEYMOUR, station.NAGAMBIE, [
    routeGraph.seymourToNagambie,
  ], [
    mapSegment.seymourToShepparton.part(1, 4),
  ]),
  new LineShapeEdge(station.NAGAMBIE, station.MURCHISON_EAST, [
    routeGraph.nagambieToMurchisonEast,
  ], [
    mapSegment.seymourToShepparton.part(2, 4),
  ]),
  new LineShapeEdge(station.MURCHISON_EAST, station.MOOROOPNA, [
    routeGraph.murchisonEastToMooroopna,
  ], [
    mapSegment.seymourToShepparton.part(3, 4),
  ]),
  new LineShapeEdge(station.MOOROOPNA, station.SHEPPARTON, [
    routeGraph.mooroopnaToShepparton,
  ], [
    mapSegment.seymourToShepparton.part(4, 4),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.SOUTHERN_CROSS, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.SEYMOUR,
  name: "Seymour",
  ptvIds: [1706, 1710, 1908],
  route,
  lineType: "regional",
  group: group.SEYMOUR,
});
