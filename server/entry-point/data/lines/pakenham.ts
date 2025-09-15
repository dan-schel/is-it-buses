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
  flindersStreetToRichmond: new StationPair(station.FLINDERS_STREET, station.RICHMOND),
  flindersStreetToSouthernCross: new StationPair(station.FLINDERS_STREET, station.SOUTHERN_CROSS),
  southernCrossToFlagstaff: new StationPair(station.SOUTHERN_CROSS, station.FLAGSTAFF),
  flagstaffToMelbourneCentral: new StationPair(station.FLAGSTAFF, station.MELBOURNE_CENTRAL),
  melbourneCentralToParliament: new StationPair(station.MELBOURNE_CENTRAL, station.PARLIAMENT),
  parliamentToRichmond: new StationPair(station.PARLIAMENT, station.RICHMOND),
  richmondToSouthYarra: new StationPair(station.RICHMOND, station.SOUTH_YARRA),
  southYarraToCaulfield: new StationPair(station.SOUTH_YARRA, station.CAULFIELD),
  caulfieldToCarnegie: new StationPair(station.CAULFIELD, station.CARNEGIE),
  carnegieToMurrumbeena: new StationPair(station.CARNEGIE, station.MURRUMBEENA),
  murrumbeenaToHughesdale: new StationPair(station.MURRUMBEENA, station.HUGHESDALE),
  hughesdaleToOakleigh: new StationPair(station.HUGHESDALE, station.OAKLEIGH),
  oakleighToHuntingdale: new StationPair(station.OAKLEIGH, station.HUNTINGDALE),
  huntingdaleToClayton: new StationPair(station.HUNTINGDALE, station.CLAYTON),
  claytonToWestall: new StationPair(station.CLAYTON, station.WESTALL),
  westallToSpringvale: new StationPair(station.WESTALL, station.SPRINGVALE),
  springvaleToSandownPark: new StationPair(station.SPRINGVALE, station.SANDOWN_PARK),
  sandownParkToNoblePark: new StationPair(station.SANDOWN_PARK, station.NOBLE_PARK),
  nobleParkToYarraman: new StationPair(station.NOBLE_PARK, station.YARRAMAN),
  yarramanToDandenong: new StationPair(station.YARRAMAN, station.DANDENONG),
  dandenongToHallam: new StationPair(station.DANDENONG, station.HALLAM),
  hallamToNarreWarren: new StationPair(station.HALLAM, station.NARRE_WARREN),
  narreWarrenToBerwick: new StationPair(station.NARRE_WARREN, station.BERWICK),
  berwickToBeaconsfield: new StationPair(station.BERWICK, station.BEACONSFIELD),
  beaconsfieldToOfficer: new StationPair(station.BEACONSFIELD, station.OFFICER),
  officerToCardiniaRoad: new StationPair(station.OFFICER, station.CARDINIA_ROAD),
  cardiniaRoadToPakenham: new StationPair(station.CARDINIA_ROAD, station.PAKENHAM),
  pakenhamToEastPakenham: new StationPair(station.PAKENHAM, station.EAST_PAKENHAM),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToRichmond: MapSegment.full(map.DANDENONG.FLINDERS_STREET_DIRECT, map.DANDENONG.RICHMOND),
  flindersStreetToSouthernCross: MapSegment.full(map.DANDENONG.FLINDERS_STREET_LOOP, map.DANDENONG.SOUTHERN_CROSS),
  southernCrossToFlagstaff: MapSegment.full(map.DANDENONG.SOUTHERN_CROSS, map.DANDENONG.FLAGSTAFF),
  flagstaffToMelbourneCentral: MapSegment.full(map.DANDENONG.FLAGSTAFF, map.DANDENONG.MELBOURNE_CENTRAL),
  melbourneCentralToParliament: MapSegment.full(map.DANDENONG.MELBOURNE_CENTRAL, map.DANDENONG.PARLIAMENT),
  parliamentToRichmond: MapSegment.full(map.DANDENONG.PARLIAMENT, map.DANDENONG.RICHMOND),
  richmondToSouthYarra: MapSegment.full(map.DANDENONG.RICHMOND, map.DANDENONG.SOUTH_YARRA),
  southYarraToCaulfield: MapSegment.full(map.DANDENONG.SOUTH_YARRA, map.DANDENONG.CAULFIELD),
  caulfieldToClayton: MapSegment.full(map.DANDENONG.CAULFIELD, map.DANDENONG.CLAYTON),
  claytonToDandenong: MapSegment.full(map.DANDENONG.CLAYTON, map.DANDENONG.DANDENONG),
  dandenongToPakenham: MapSegment.full(map.DANDENONG.DANDENONG, map.DANDENONG.PAKENHAM),
  pakenhamToEastPakenham: MapSegment.full(map.DANDENONG.PAKENHAM, map.DANDENONG.EAST_PAKENHAM),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge("the-city", station.RICHMOND, [
    routeGraph.flindersStreetToRichmond,
    routeGraph.flindersStreetToSouthernCross,
    routeGraph.southernCrossToFlagstaff,
    routeGraph.flagstaffToMelbourneCentral,
    routeGraph.melbourneCentralToParliament,
    routeGraph.parliamentToRichmond,
  ], [
    mapSegment.flindersStreetToRichmond,
    mapSegment.flindersStreetToSouthernCross,
    mapSegment.southernCrossToFlagstaff,
    mapSegment.flagstaffToMelbourneCentral,
    mapSegment.melbourneCentralToParliament,
    mapSegment.parliamentToRichmond,
  ]),
  new LineShapeEdge(station.RICHMOND, station.SOUTH_YARRA, [
    routeGraph.richmondToSouthYarra,
  ], [
    mapSegment.richmondToSouthYarra,
  ]),
  new LineShapeEdge(station.SOUTH_YARRA, station.CAULFIELD, [
    routeGraph.southYarraToCaulfield,
  ], [
    mapSegment.southYarraToCaulfield,
  ]),
  new LineShapeEdge(station.CAULFIELD, station.CARNEGIE, [
    routeGraph.caulfieldToCarnegie,
  ], [
    mapSegment.caulfieldToClayton.part(1, 6),
  ]),
  new LineShapeEdge(station.CARNEGIE, station.MURRUMBEENA, [
    routeGraph.carnegieToMurrumbeena,
  ], [
    mapSegment.caulfieldToClayton.part(2, 6),
  ]),
  new LineShapeEdge(station.MURRUMBEENA, station.HUGHESDALE, [
    routeGraph.murrumbeenaToHughesdale,
  ], [
    mapSegment.caulfieldToClayton.part(3, 6),
  ]),
  new LineShapeEdge(station.HUGHESDALE, station.OAKLEIGH, [
    routeGraph.hughesdaleToOakleigh,
  ], [
    mapSegment.caulfieldToClayton.part(4, 6),
  ]),
  new LineShapeEdge(station.OAKLEIGH, station.HUNTINGDALE, [
    routeGraph.oakleighToHuntingdale,
  ], [
    mapSegment.caulfieldToClayton.part(5, 6),
  ]),
  new LineShapeEdge(station.HUNTINGDALE, station.CLAYTON, [
    routeGraph.huntingdaleToClayton,
  ], [
    mapSegment.caulfieldToClayton.part(6, 6),
  ]),
  new LineShapeEdge(station.CLAYTON, station.WESTALL, [
    routeGraph.claytonToWestall,
  ], [
    mapSegment.claytonToDandenong.part(1, 6),
  ]),
  new LineShapeEdge(station.WESTALL, station.SPRINGVALE, [
    routeGraph.westallToSpringvale,
  ], [
    mapSegment.claytonToDandenong.part(2, 6),
  ]),
  new LineShapeEdge(station.SPRINGVALE, station.SANDOWN_PARK, [
    routeGraph.springvaleToSandownPark,
  ], [
    mapSegment.claytonToDandenong.part(3, 6),
  ]),
  new LineShapeEdge(station.SANDOWN_PARK, station.NOBLE_PARK, [
    routeGraph.sandownParkToNoblePark,
  ], [
    mapSegment.claytonToDandenong.part(4, 6),
  ]),
  new LineShapeEdge(station.NOBLE_PARK, station.YARRAMAN, [
    routeGraph.nobleParkToYarraman,
  ], [
    mapSegment.claytonToDandenong.part(5, 6),
  ]),
  new LineShapeEdge(station.YARRAMAN, station.DANDENONG, [
    routeGraph.yarramanToDandenong,
  ], [
    mapSegment.claytonToDandenong.part(6, 6),
  ]),
  new LineShapeEdge(station.DANDENONG, station.HALLAM, [
    routeGraph.dandenongToHallam,
  ], [
    mapSegment.dandenongToPakenham.part(1, 7),
  ]),
  new LineShapeEdge(station.HALLAM, station.NARRE_WARREN, [
    routeGraph.hallamToNarreWarren,
  ], [
    mapSegment.dandenongToPakenham.part(2, 7),
  ]),
  new LineShapeEdge(station.NARRE_WARREN, station.BERWICK, [
    routeGraph.narreWarrenToBerwick,
  ], [
    mapSegment.dandenongToPakenham.part(3, 7),
  ]),
  new LineShapeEdge(station.BERWICK, station.BEACONSFIELD, [
    routeGraph.berwickToBeaconsfield,
  ], [
    mapSegment.dandenongToPakenham.part(4, 7),
  ]),
  new LineShapeEdge(station.BEACONSFIELD, station.OFFICER, [
    routeGraph.beaconsfieldToOfficer,
  ], [
    mapSegment.dandenongToPakenham.part(5, 7),
  ]),
  new LineShapeEdge(station.OFFICER, station.CARDINIA_ROAD, [
    routeGraph.officerToCardiniaRoad,
  ], [
    mapSegment.dandenongToPakenham.part(6, 7),
  ]),
  new LineShapeEdge(station.CARDINIA_ROAD, station.PAKENHAM, [
    routeGraph.cardiniaRoadToPakenham,
  ], [
    mapSegment.dandenongToPakenham.part(7, 7),
  ]),
  new LineShapeEdge(station.PAKENHAM, station.EAST_PAKENHAM, [
    routeGraph.pakenhamToEastPakenham,
  ], [
    mapSegment.pakenhamToEastPakenham,
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.PAKENHAM,
  name: "Pakenham",
  ptvIds: [11],
  route,
  lineType: "suburban",
  group: group.DANDENONG,
});
