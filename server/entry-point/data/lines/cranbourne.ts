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
  dandenongToLynbrook: new StationPair(station.DANDENONG, station.LYNBROOK),
  lynbrookToMerindaPark: new StationPair(station.LYNBROOK, station.MERINDA_PARK),
  merindaParkToCranbourne: new StationPair(station.MERINDA_PARK, station.CRANBOURNE),
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
  dandenongToCranbourne: MapSegment.full(map.DANDENONG.DANDENONG, map.DANDENONG.CRANBOURNE),
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
  new LineShapeEdge(station.DANDENONG, station.LYNBROOK, [
    routeGraph.dandenongToLynbrook,
  ], [
    mapSegment.dandenongToCranbourne.part(1, 3),
  ]),
  new LineShapeEdge(station.LYNBROOK, station.MERINDA_PARK, [
    routeGraph.lynbrookToMerindaPark,
  ], [
    mapSegment.dandenongToCranbourne.part(2, 3),
  ]),
  new LineShapeEdge(station.MERINDA_PARK, station.CRANBOURNE, [
    routeGraph.merindaParkToCranbourne,
  ], [
    mapSegment.dandenongToCranbourne.part(3, 3),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.CRANBOURNE,
  name: "Cranbourne",
  ptvIds: [4],
  route,
  lineType: "suburban",
  group: group.DANDENONG,
});
