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
  southernCrossToPakenham: new StationPair(station.SOUTHERN_CROSS, station.PAKENHAM),
  flindersStreetToPakenham: new StationPair(station.FLINDERS_STREET, station.PAKENHAM),
  richmondToPakenham: new StationPair(station.RICHMOND, station.PAKENHAM),
  caulfieldToPakenham: new StationPair(station.CAULFIELD, station.PAKENHAM),
  claytonToPakenham: new StationPair(station.CLAYTON, station.PAKENHAM),
  dandenongToPakenham: new StationPair(station.DANDENONG, station.PAKENHAM),
  pakenhamToNarNarGoon: new StationPair(station.PAKENHAM, station.NAR_NAR_GOON),
  narNarGoonToTynong: new StationPair(station.NAR_NAR_GOON, station.TYNONG),
  tynongToGarfield: new StationPair(station.TYNONG, station.GARFIELD),
  garfieldToBunyip: new StationPair(station.GARFIELD, station.BUNYIP),
  bunyipToLongwarry: new StationPair(station.BUNYIP, station.LONGWARRY),
  longwarryToDrouin: new StationPair(station.LONGWARRY, station.DROUIN),
  drouinToWarragul: new StationPair(station.DROUIN, station.WARRAGUL),
  warragulToYarragon: new StationPair(station.WARRAGUL, station.YARRAGON),
  yarragonToTrafalgar: new StationPair(station.YARRAGON, station.TRAFALGAR),
  trafalgarToMoe: new StationPair(station.TRAFALGAR, station.MOE),
  moeToMorwell: new StationPair(station.MOE, station.MORWELL),
  morwellToTraralgon: new StationPair(station.MORWELL, station.TRARALGON),
  traralgonToRosedale: new StationPair(station.TRARALGON, station.ROSEDALE),
  rosedaleToSale: new StationPair(station.ROSEDALE, station.SALE),
  saleToStratford: new StationPair(station.SALE, station.STRATFORD),
  stratfordToBairnsdale: new StationPair(station.STRATFORD, station.BAIRNSDALE),
};

// prettier-ignore
const mapSegment = {
  southernCrossToFlindersStreet: MapSegment.full(map.GIPPSLAND.SOUTHERN_CROSS, map.GIPPSLAND.FLINDERS_STREET),
  flindersStreetToRichmond: MapSegment.full(map.GIPPSLAND.FLINDERS_STREET, map.GIPPSLAND.RICHMOND),
  richmondToSouthYarra: MapSegment.full(map.GIPPSLAND.RICHMOND, map.GIPPSLAND.SOUTH_YARRA),
  southYarraToCaulfield: MapSegment.full(map.GIPPSLAND.SOUTH_YARRA, map.GIPPSLAND.CAULFIELD),
  caulfieldToClayton: MapSegment.full(map.GIPPSLAND.CAULFIELD, map.GIPPSLAND.CLAYTON),
  claytonToDandenong: MapSegment.full(map.GIPPSLAND.CLAYTON, map.GIPPSLAND.DANDENONG),
  dandenongToPakenham: MapSegment.full(map.GIPPSLAND.DANDENONG, map.GIPPSLAND.PAKENHAM),
  pakenhamToEastPakenham: MapSegment.full(map.GIPPSLAND.PAKENHAM, map.GIPPSLAND.EAST_PAKENHAM),
  eastPakenhamToBairnsdale: MapSegment.full(map.GIPPSLAND.EAST_PAKENHAM, map.GIPPSLAND.BAIRNSDALE),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.SOUTHERN_CROSS, station.FLINDERS_STREET, [
    routeGraph.southernCrossToPakenham,
  ], [
    mapSegment.southernCrossToFlindersStreet,
  ]),
  new LineShapeEdge(station.FLINDERS_STREET, station.RICHMOND, [
    routeGraph.southernCrossToPakenham,
    routeGraph.flindersStreetToPakenham,
  ], [
    mapSegment.flindersStreetToRichmond,
  ]),
  new LineShapeEdge(station.RICHMOND, station.CAULFIELD, [
    routeGraph.southernCrossToPakenham,
    routeGraph.flindersStreetToPakenham,
    routeGraph.richmondToPakenham,
  ], [
    mapSegment.richmondToSouthYarra,
    mapSegment.southYarraToCaulfield,
  ]),
  new LineShapeEdge(station.CAULFIELD, station.CLAYTON, [
    routeGraph.southernCrossToPakenham,
    routeGraph.flindersStreetToPakenham,
    routeGraph.richmondToPakenham,
    routeGraph.caulfieldToPakenham,
  ], [
    mapSegment.caulfieldToClayton,
  ]),
  new LineShapeEdge(station.CLAYTON, station.DANDENONG, [
    routeGraph.southernCrossToPakenham,
    routeGraph.flindersStreetToPakenham,
    routeGraph.richmondToPakenham,
    routeGraph.caulfieldToPakenham,
    routeGraph.claytonToPakenham,
  ], [
    mapSegment.claytonToDandenong,
  ]),
  new LineShapeEdge(station.DANDENONG, station.PAKENHAM, [
    routeGraph.southernCrossToPakenham,
    routeGraph.flindersStreetToPakenham,
    routeGraph.richmondToPakenham,
    routeGraph.caulfieldToPakenham,
    routeGraph.claytonToPakenham,
    routeGraph.dandenongToPakenham,
  ], [
    mapSegment.dandenongToPakenham,
  ]),
  new LineShapeEdge(station.PAKENHAM, station.NAR_NAR_GOON, [
    routeGraph.pakenhamToNarNarGoon,
  ], [
    mapSegment.pakenhamToEastPakenham,
    mapSegment.eastPakenhamToBairnsdale.part(1, 16),
  ]),
  new LineShapeEdge(station.NAR_NAR_GOON, station.TYNONG, [
    routeGraph.narNarGoonToTynong,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(2, 16),
  ]),
  new LineShapeEdge(station.TYNONG, station.GARFIELD, [
    routeGraph.tynongToGarfield,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(3, 16),
  ]),
  new LineShapeEdge(station.GARFIELD, station.BUNYIP, [
    routeGraph.garfieldToBunyip,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(4, 16),
  ]),
  new LineShapeEdge(station.BUNYIP, station.LONGWARRY, [
    routeGraph.bunyipToLongwarry,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(5, 16),
  ]),
  new LineShapeEdge(station.LONGWARRY, station.DROUIN, [
    routeGraph.longwarryToDrouin,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(6, 16),
  ]),
  new LineShapeEdge(station.DROUIN, station.WARRAGUL, [
    routeGraph.drouinToWarragul,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(7, 16),
  ]),
  new LineShapeEdge(station.WARRAGUL, station.YARRAGON, [
    routeGraph.warragulToYarragon,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(8, 16),
  ]),
  new LineShapeEdge(station.YARRAGON, station.TRAFALGAR, [
    routeGraph.yarragonToTrafalgar,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(9, 16),
  ]),
  new LineShapeEdge(station.TRAFALGAR, station.MOE, [
    routeGraph.trafalgarToMoe,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(10, 16),
  ]),
  new LineShapeEdge(station.MOE, station.MORWELL, [
    routeGraph.moeToMorwell,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(11, 16),
  ]),
  new LineShapeEdge(station.MORWELL, station.TRARALGON, [
    routeGraph.morwellToTraralgon,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(12, 16),
  ]),
  new LineShapeEdge(station.TRARALGON, station.ROSEDALE, [
    routeGraph.traralgonToRosedale,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(13, 16),
  ]),
  new LineShapeEdge(station.ROSEDALE, station.SALE, [
    routeGraph.rosedaleToSale,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(14, 16),
  ]),
  new LineShapeEdge(station.SALE, station.STRATFORD, [
    routeGraph.saleToStratford,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(15, 16),
  ]),
  new LineShapeEdge(station.STRATFORD, station.BAIRNSDALE, [
    routeGraph.stratfordToBairnsdale,
  ], [
    mapSegment.eastPakenhamToBairnsdale.part(16, 16),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.SOUTHERN_CROSS, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.GIPPSLAND,
  name: "Gippsland",
  ptvIds: [1823, 1824],
  route,
  lineType: "regional",
  group: group.GIPPSLAND,
});
