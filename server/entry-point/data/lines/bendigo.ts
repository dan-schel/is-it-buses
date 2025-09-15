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
  southernCrossToSunbury: new StationPair(station.SOUTHERN_CROSS, station.SUNBURY),
  footscrayToSunbury: new StationPair(station.FOOTSCRAY, station.SUNBURY),
  watergardensToSunbury: new StationPair(station.WATERGARDENS, station.SUNBURY),
  sunburyToClarkefield: new StationPair(station.SUNBURY, station.CLARKEFIELD),
  clarkefieldToRiddellsCreek: new StationPair(station.CLARKEFIELD, station.RIDDELLS_CREEK),
  riddellsCreekToGisborne: new StationPair(station.RIDDELLS_CREEK, station.GISBORNE),
  gisborneToMacedon: new StationPair(station.GISBORNE, station.MACEDON),
  macedonToWoodend: new StationPair(station.MACEDON, station.WOODEND),
  woodendToKyneton: new StationPair(station.WOODEND, station.KYNETON),
  kynetonToMalmsbury: new StationPair(station.KYNETON, station.MALMSBURY),
  malmsburyToCastlemaine: new StationPair(station.MALMSBURY, station.CASTLEMAINE),
  castlemaineToKangarooFlat: new StationPair(station.CASTLEMAINE, station.KANGAROO_FLAT),
  kangarooFlatToBendigo: new StationPair(station.KANGAROO_FLAT, station.BENDIGO),
  bendigoToEpsom: new StationPair(station.BENDIGO, station.EPSOM),
  epsomToHuntly: new StationPair(station.EPSOM, station.HUNTLY),
  huntlyToGoornong: new StationPair(station.HUNTLY, station.GOORNONG),
  goornongToElmore: new StationPair(station.GOORNONG, station.ELMORE),
  elmoreToRochester: new StationPair(station.ELMORE, station.ROCHESTER),
  rochesterToEchuca: new StationPair(station.ROCHESTER, station.ECHUCA),
  bendigoToEaglehawk: new StationPair(station.BENDIGO, station.EAGLEHAWK),
  eaglehawkToRaywood: new StationPair(station.EAGLEHAWK, station.RAYWOOD),
  raywoodToDingee: new StationPair(station.RAYWOOD, station.DINGEE),
  dingeeToPyramid: new StationPair(station.DINGEE, station.PYRAMID),
  pyramidToKerang: new StationPair(station.PYRAMID, station.KERANG),
  kerangToSwanHill: new StationPair(station.KERANG, station.SWAN_HILL),
};

// prettier-ignore
const mapSegment = {
  southernCrossToNorthMelbourneJunction: MapSegment.full(map.REGIONAL_WESTERN.SOUTHERN_CROSS, map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION),
  northMelbourneJunctionToNorthMelbourne: MapSegment.full(map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION, map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL),
  northMelbourneToFootscray: MapSegment.full(map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL, map.REGIONAL_WESTERN.FOOTSCRAY),
  footscrayToSunshineJunction: MapSegment.full(map.REGIONAL_WESTERN.FOOTSCRAY, map.REGIONAL_WESTERN.SUNSHINE_JUNCTION),
  sunshineJunctionToSunshine: MapSegment.full(map.REGIONAL_WESTERN.SUNSHINE_JUNCTION, map.REGIONAL_WESTERN.SUNSHINE_BENDIGO),
  sunshineToWatergardens: MapSegment.full(map.REGIONAL_WESTERN.SUNSHINE_BENDIGO, map.REGIONAL_WESTERN.WATERGARDENS),
  watergardensToSunbury: MapSegment.full(map.REGIONAL_WESTERN.WATERGARDENS, map.REGIONAL_WESTERN.SUNBURY),
  sunburyToBendigo: MapSegment.full(map.REGIONAL_WESTERN.SUNBURY, map.REGIONAL_WESTERN.BENDIGO),
  bendigoToEchuca: MapSegment.full(map.REGIONAL_WESTERN.BENDIGO, map.REGIONAL_WESTERN.ECHUCA),
  bendigoToSwanHill: MapSegment.full(map.REGIONAL_WESTERN.BENDIGO, map.REGIONAL_WESTERN.SWAN_HILL),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.SOUTHERN_CROSS, station.FOOTSCRAY, [
    routeGraph.southernCrossToSunbury,
  ], [
    mapSegment.southernCrossToNorthMelbourneJunction,
    mapSegment.northMelbourneJunctionToNorthMelbourne,
    mapSegment.northMelbourneToFootscray,
  ]),
  new LineShapeEdge(station.FOOTSCRAY, station.WATERGARDENS, [
    routeGraph.southernCrossToSunbury,
    routeGraph.footscrayToSunbury,
  ], [
    mapSegment.footscrayToSunshineJunction,
    mapSegment.sunshineJunctionToSunshine,
    mapSegment.sunshineToWatergardens,
  ]),
  new LineShapeEdge(station.WATERGARDENS, station.SUNBURY, [
    routeGraph.southernCrossToSunbury,
    routeGraph.footscrayToSunbury,
    routeGraph.watergardensToSunbury,
  ], [
    mapSegment.watergardensToSunbury,
  ]),
  new LineShapeEdge(station.SUNBURY, station.CLARKEFIELD, [
    routeGraph.sunburyToClarkefield,
  ], [
    mapSegment.sunburyToBendigo.part(1, 10),
  ]),
  new LineShapeEdge(station.CLARKEFIELD, station.RIDDELLS_CREEK, [
    routeGraph.clarkefieldToRiddellsCreek,
  ], [
    mapSegment.sunburyToBendigo.part(2, 10),
  ]),
  new LineShapeEdge(station.RIDDELLS_CREEK, station.GISBORNE, [
    routeGraph.riddellsCreekToGisborne,
  ], [
    mapSegment.sunburyToBendigo.part(3, 10),
  ]),
  new LineShapeEdge(station.GISBORNE, station.MACEDON, [
    routeGraph.gisborneToMacedon,
  ], [
    mapSegment.sunburyToBendigo.part(4, 10),
  ]),
  new LineShapeEdge(station.MACEDON, station.WOODEND, [
    routeGraph.macedonToWoodend,
  ], [
    mapSegment.sunburyToBendigo.part(5, 10),
  ]),
  new LineShapeEdge(station.WOODEND, station.KYNETON, [
    routeGraph.woodendToKyneton,
  ], [
    mapSegment.sunburyToBendigo.part(6, 10),
  ]),
  new LineShapeEdge(station.KYNETON, station.MALMSBURY, [
    routeGraph.kynetonToMalmsbury,
  ], [
    mapSegment.sunburyToBendigo.part(7, 10),
  ]),
  new LineShapeEdge(station.MALMSBURY, station.CASTLEMAINE, [
    routeGraph.malmsburyToCastlemaine,
  ], [
    mapSegment.sunburyToBendigo.part(8, 10),
  ]),
  new LineShapeEdge(station.CASTLEMAINE, station.KANGAROO_FLAT, [
    routeGraph.castlemaineToKangarooFlat,
  ], [
    mapSegment.sunburyToBendigo.part(9, 10),
  ]),
  new LineShapeEdge(station.KANGAROO_FLAT, station.BENDIGO, [
    routeGraph.kangarooFlatToBendigo,
  ], [
    mapSegment.sunburyToBendigo.part(10, 10),
  ]),
  new LineShapeEdge(station.BENDIGO, station.EPSOM, [
    routeGraph.bendigoToEpsom,
  ], [
    mapSegment.bendigoToEchuca.part(1, 6),
  ]),
  new LineShapeEdge(station.EPSOM, station.HUNTLY, [
    routeGraph.epsomToHuntly,
  ], [
    mapSegment.bendigoToEchuca.part(2, 6),
  ]),
  new LineShapeEdge(station.HUNTLY, station.GOORNONG, [
    routeGraph.huntlyToGoornong,
  ], [
    mapSegment.bendigoToEchuca.part(3, 6),
  ]),
  new LineShapeEdge(station.GOORNONG, station.ELMORE, [
    routeGraph.goornongToElmore,
  ], [
    mapSegment.bendigoToEchuca.part(4, 6),
  ]),
  new LineShapeEdge(station.ELMORE, station.ROCHESTER, [
    routeGraph.elmoreToRochester,
  ], [
    mapSegment.bendigoToEchuca.part(5, 6),
  ]),
  new LineShapeEdge(station.ROCHESTER, station.ECHUCA, [
    routeGraph.rochesterToEchuca,
  ], [
    mapSegment.bendigoToEchuca.part(6, 6),
  ]),
  new LineShapeEdge(station.BENDIGO, station.EAGLEHAWK, [
    routeGraph.bendigoToEaglehawk,
  ], [
    mapSegment.bendigoToSwanHill.part(1, 6),
  ]),
  new LineShapeEdge(station.EAGLEHAWK, station.RAYWOOD, [
    routeGraph.eaglehawkToRaywood,
  ], [
    mapSegment.bendigoToSwanHill.part(2, 6),
  ]),
  new LineShapeEdge(station.RAYWOOD, station.DINGEE, [
    routeGraph.raywoodToDingee,
  ], [
    mapSegment.bendigoToSwanHill.part(3, 6),
  ]),
  new LineShapeEdge(station.DINGEE, station.PYRAMID, [
    routeGraph.dingeeToPyramid,
  ], [
    mapSegment.bendigoToSwanHill.part(4, 6),
  ]),
  new LineShapeEdge(station.PYRAMID, station.KERANG, [
    routeGraph.pyramidToKerang,
  ], [
    mapSegment.bendigoToSwanHill.part(5, 6),
  ]),
  new LineShapeEdge(station.KERANG, station.SWAN_HILL, [
    routeGraph.kerangToSwanHill,
  ], [
    mapSegment.bendigoToSwanHill.part(6, 6),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.SOUTHERN_CROSS, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.BENDIGO,
  name: "Bendigo",
  ptvIds: [1740, 1848, 1849],
  route,
  lineType: "regional",
  group: group.BENDIGO,
});
