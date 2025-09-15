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
  southernCrossToArdeer: new StationPair(station.SOUTHERN_CROSS, station.ARDEER),
  footscrayToArdeer: new StationPair(station.FOOTSCRAY, station.ARDEER),
  sunshineToArdeer: new StationPair(station.SUNSHINE, station.ARDEER),
  ardeerToDeerPark: new StationPair(station.ARDEER, station.DEER_PARK),
  deerParkToCarolineSprings: new StationPair(station.DEER_PARK, station.CAROLINE_SPRINGS),
  carolineSpringsToRockbank: new StationPair(station.CAROLINE_SPRINGS, station.ROCKBANK),
  rockbankToCobblebank: new StationPair(station.ROCKBANK, station.COBBLEBANK),
  cobblebankToMelton: new StationPair(station.COBBLEBANK, station.MELTON),
  meltonToBacchusMarsh: new StationPair(station.MELTON, station.BACCHUS_MARSH),
  bacchusMarshToBallan: new StationPair(station.BACCHUS_MARSH, station.BALLAN),
  ballanToBallarat: new StationPair(station.BALLAN, station.BALLARAT),
  ballaratToCreswick: new StationPair(station.BALLARAT, station.CRESWICK),
  creswickToClunes: new StationPair(station.CRESWICK, station.CLUNES),
  clunesToTalbot: new StationPair(station.CLUNES, station.TALBOT),
  talbotToMaryborough: new StationPair(station.TALBOT, station.MARYBOROUGH),
  ballaratToWendouree: new StationPair(station.BALLARAT, station.WENDOUREE),
  wendoureeToBeaufort: new StationPair(station.WENDOUREE, station.BEAUFORT),
  beaufortToArarat: new StationPair(station.BEAUFORT, station.ARARAT),
};

// prettier-ignore
const mapSegment = {
  southernCrossToNorthMelbourneJunction: MapSegment.full(map.REGIONAL_WESTERN.SOUTHERN_CROSS, map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION),
  northMelbourneJunctionToNorthMelbourne: MapSegment.full(map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION, map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL),
  northMelbourneToFootscray: MapSegment.full(map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL, map.REGIONAL_WESTERN.FOOTSCRAY),
  footscrayToSunshineJunction: MapSegment.full(map.REGIONAL_WESTERN.FOOTSCRAY, map.REGIONAL_WESTERN.SUNSHINE_JUNCTION),
  sunshineJunctionToSunshine: MapSegment.full(map.REGIONAL_WESTERN.SUNSHINE_JUNCTION, map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK),
  sunshineToDeerPark: MapSegment.full(map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK, map.REGIONAL_WESTERN.DEER_PARK),
  deerParkToBallarat: MapSegment.full(map.REGIONAL_WESTERN.DEER_PARK, map.REGIONAL_WESTERN.BALLARAT),
  ballaratToMaryborough: MapSegment.full(map.REGIONAL_WESTERN.BALLARAT, map.REGIONAL_WESTERN.MARYBOROUGH),
  ballaratToArarat: MapSegment.full(map.REGIONAL_WESTERN.BALLARAT, map.REGIONAL_WESTERN.ARARAT),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.SOUTHERN_CROSS, station.FOOTSCRAY, [
    routeGraph.southernCrossToArdeer,
  ], [
    mapSegment.southernCrossToNorthMelbourneJunction,
    mapSegment.northMelbourneJunctionToNorthMelbourne,
    mapSegment.northMelbourneToFootscray,
  ]),
  new LineShapeEdge(station.FOOTSCRAY, station.SUNSHINE, [
    routeGraph.southernCrossToArdeer,
    routeGraph.footscrayToArdeer,
  ], [
    mapSegment.footscrayToSunshineJunction,
    mapSegment.sunshineJunctionToSunshine,
  ]),
  new LineShapeEdge(station.SUNSHINE, station.ARDEER, [
    routeGraph.southernCrossToArdeer,
    routeGraph.footscrayToArdeer,
    routeGraph.sunshineToArdeer,
  ], [
    mapSegment.sunshineToDeerPark.part(1, 2),
  ]),
  new LineShapeEdge(station.ARDEER, station.DEER_PARK, [
    routeGraph.ardeerToDeerPark,
  ], [
    mapSegment.sunshineToDeerPark.part(2, 2),
  ]),
  new LineShapeEdge(station.DEER_PARK, station.CAROLINE_SPRINGS, [
    routeGraph.deerParkToCarolineSprings,
  ], [
    mapSegment.deerParkToBallarat.part(1, 7),
  ]),
  new LineShapeEdge(station.CAROLINE_SPRINGS, station.ROCKBANK, [
    routeGraph.carolineSpringsToRockbank,
  ], [
    mapSegment.deerParkToBallarat.part(2, 7),
  ]),
  new LineShapeEdge(station.ROCKBANK, station.COBBLEBANK, [
    routeGraph.rockbankToCobblebank,
  ], [
    mapSegment.deerParkToBallarat.part(3, 7),
  ]),
  new LineShapeEdge(station.COBBLEBANK, station.MELTON, [
    routeGraph.cobblebankToMelton,
  ], [
    mapSegment.deerParkToBallarat.part(4, 7),
  ]),
  new LineShapeEdge(station.MELTON, station.BACCHUS_MARSH, [
    routeGraph.meltonToBacchusMarsh,
  ], [
    mapSegment.deerParkToBallarat.part(5, 7),
  ]),
  new LineShapeEdge(station.BACCHUS_MARSH, station.BALLAN, [
    routeGraph.bacchusMarshToBallan,
  ], [
    mapSegment.deerParkToBallarat.part(6, 7),
  ]),
  new LineShapeEdge(station.BALLAN, station.BALLARAT, [
    routeGraph.ballanToBallarat,
  ], [
    mapSegment.deerParkToBallarat.part(7, 7),
  ]),
  new LineShapeEdge(station.BALLARAT, station.CRESWICK, [
    routeGraph.ballaratToCreswick,
  ], [
    mapSegment.ballaratToMaryborough.part(1, 4),
  ]),
  new LineShapeEdge(station.CRESWICK, station.CLUNES, [
    routeGraph.creswickToClunes,
  ], [
    mapSegment.ballaratToMaryborough.part(2, 4),
  ]),
  new LineShapeEdge(station.CLUNES, station.TALBOT, [
    routeGraph.clunesToTalbot,
  ], [
    mapSegment.ballaratToMaryborough.part(3, 4),
  ]),
  new LineShapeEdge(station.TALBOT, station.MARYBOROUGH, [
    routeGraph.talbotToMaryborough,
  ], [
    mapSegment.ballaratToMaryborough.part(4, 4),
  ]),
  new LineShapeEdge(station.BALLARAT, station.WENDOUREE, [
    routeGraph.ballaratToWendouree,
  ], [
    mapSegment.ballaratToArarat.part(1, 3),
  ]),
  new LineShapeEdge(station.WENDOUREE, station.BEAUFORT, [
    routeGraph.wendoureeToBeaufort,
  ], [
    mapSegment.ballaratToArarat.part(2, 3),
  ]),
  new LineShapeEdge(station.BEAUFORT, station.ARARAT, [
    routeGraph.beaufortToArarat,
  ], [
    mapSegment.ballaratToArarat.part(3, 3),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.SOUTHERN_CROSS, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.BALLARAT,
  name: "Ballarat",
  ptvIds: [1728, 1837, 4871],
  route,
  lineType: "regional",
  group: group.BALLARAT,
});
