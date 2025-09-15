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
  richmondToEastRichmond: new StationPair(station.RICHMOND, station.EAST_RICHMOND),
  eastRichmondToBurnley: new StationPair(station.EAST_RICHMOND, station.BURNLEY),
  burnleyToHawthorn: new StationPair(station.BURNLEY, station.HAWTHORN),
  hawthornToGlenferrie: new StationPair(station.HAWTHORN, station.GLENFERRIE),
  glenferrieToAuburn: new StationPair(station.GLENFERRIE, station.AUBURN),
  auburnToCamberwell: new StationPair(station.AUBURN, station.CAMBERWELL),
  camberwellToEastCamberwell: new StationPair(station.CAMBERWELL, station.EAST_CAMBERWELL),
  eastCamberwellToCanterbury: new StationPair(station.EAST_CAMBERWELL, station.CANTERBURY),
  canterburyToChatham: new StationPair(station.CANTERBURY, station.CHATHAM),
  chathamToUnion: new StationPair(station.CHATHAM, station.UNION),
  unionToBoxHill: new StationPair(station.UNION, station.BOX_HILL),
  boxHillToLaburnum: new StationPair(station.BOX_HILL, station.LABURNUM),
  laburnumToBlackburn: new StationPair(station.LABURNUM, station.BLACKBURN),
  blackburnToNunawading: new StationPair(station.BLACKBURN, station.NUNAWADING),
  nunawadingToMitcham: new StationPair(station.NUNAWADING, station.MITCHAM),
  mitchamToHeatherdale: new StationPair(station.MITCHAM, station.HEATHERDALE),
  heatherdaleToRingwood: new StationPair(station.HEATHERDALE, station.RINGWOOD),
  ringwoodToRingwoodEast: new StationPair(station.RINGWOOD, station.RINGWOOD_EAST),
  ringwoodEastToCroydon: new StationPair(station.RINGWOOD_EAST, station.CROYDON),
  croydonToMooroolbark: new StationPair(station.CROYDON, station.MOOROOLBARK),
  mooroolbarkToLilydale: new StationPair(station.MOOROOLBARK, station.LILYDALE),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToRichmond: MapSegment.full(map.BURNLEY.FLINDERS_STREET_DIRECT, map.BURNLEY.RICHMOND),
  flindersStreetToSouthernCross: MapSegment.full(map.BURNLEY.FLINDERS_STREET_LOOP, map.BURNLEY.SOUTHERN_CROSS),
  southernCrossToFlagstaff: MapSegment.full(map.BURNLEY.SOUTHERN_CROSS, map.BURNLEY.FLAGSTAFF),
  flagstaffToMelbourneCentral: MapSegment.full(map.BURNLEY.FLAGSTAFF, map.BURNLEY.MELBOURNE_CENTRAL),
  melbourneCentralToParliament: MapSegment.full(map.BURNLEY.MELBOURNE_CENTRAL, map.BURNLEY.PARLIAMENT),
  parliamentToRichmond: MapSegment.full(map.BURNLEY.PARLIAMENT, map.BURNLEY.RICHMOND),
  richmondToBurnley: MapSegment.full(map.BURNLEY.RICHMOND, map.BURNLEY.BURNLEY),
  burnleyToCamberwell: MapSegment.full(map.BURNLEY.BURNLEY, map.BURNLEY.CAMBERWELL),
  camberwellToRingwood: MapSegment.full(map.BURNLEY.CAMBERWELL, map.BURNLEY.RINGWOOD),
  ringwoodToLilydale: MapSegment.full(map.BURNLEY.RINGWOOD, map.BURNLEY.LILYDALE),
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
  new LineShapeEdge(station.RICHMOND, station.EAST_RICHMOND, [
    routeGraph.richmondToEastRichmond,
  ], [
    mapSegment.richmondToBurnley.part(1, 2),
  ]),
  new LineShapeEdge(station.EAST_RICHMOND, station.BURNLEY, [
    routeGraph.eastRichmondToBurnley,
  ], [
    mapSegment.richmondToBurnley.part(2, 2),
  ]),
  new LineShapeEdge(station.BURNLEY, station.HAWTHORN, [
    routeGraph.burnleyToHawthorn,
  ], [
    mapSegment.burnleyToCamberwell.part(1, 4),
  ]),
  new LineShapeEdge(station.HAWTHORN, station.GLENFERRIE, [
    routeGraph.hawthornToGlenferrie,
  ], [
    mapSegment.burnleyToCamberwell.part(2, 4),
  ]),
  new LineShapeEdge(station.GLENFERRIE, station.AUBURN, [
    routeGraph.glenferrieToAuburn,
  ], [
    mapSegment.burnleyToCamberwell.part(3, 4),
  ]),
  new LineShapeEdge(station.AUBURN, station.CAMBERWELL, [
    routeGraph.auburnToCamberwell,
  ], [
    mapSegment.burnleyToCamberwell.part(4, 4),
  ]),
  new LineShapeEdge(station.CAMBERWELL, station.EAST_CAMBERWELL, [
    routeGraph.camberwellToEastCamberwell,
  ], [
    mapSegment.camberwellToRingwood.part(1, 11),
  ]),
  new LineShapeEdge(station.EAST_CAMBERWELL, station.CANTERBURY, [
    routeGraph.eastCamberwellToCanterbury,
  ], [
    mapSegment.camberwellToRingwood.part(2, 11),
  ]),
  new LineShapeEdge(station.CANTERBURY, station.CHATHAM, [
    routeGraph.canterburyToChatham,
  ], [
    mapSegment.camberwellToRingwood.part(3, 11),
  ]),
  new LineShapeEdge(station.CHATHAM, station.UNION, [
    routeGraph.chathamToUnion,
  ], [
    mapSegment.camberwellToRingwood.part(4, 11),
  ]),
  new LineShapeEdge(station.UNION, station.BOX_HILL, [
    routeGraph.unionToBoxHill,
  ], [
    mapSegment.camberwellToRingwood.part(5, 11),
  ]),
  new LineShapeEdge(station.BOX_HILL, station.LABURNUM, [
    routeGraph.boxHillToLaburnum,
  ], [
    mapSegment.camberwellToRingwood.part(6, 11),
  ]),
  new LineShapeEdge(station.LABURNUM, station.BLACKBURN, [
    routeGraph.laburnumToBlackburn,
  ], [
    mapSegment.camberwellToRingwood.part(7, 11),
  ]),
  new LineShapeEdge(station.BLACKBURN, station.NUNAWADING, [
    routeGraph.blackburnToNunawading,
  ], [
    mapSegment.camberwellToRingwood.part(8, 11),
  ]),
  new LineShapeEdge(station.NUNAWADING, station.MITCHAM, [
    routeGraph.nunawadingToMitcham,
  ], [
    mapSegment.camberwellToRingwood.part(9, 11),
  ]),
  new LineShapeEdge(station.MITCHAM, station.HEATHERDALE, [
    routeGraph.mitchamToHeatherdale,
  ], [
    mapSegment.camberwellToRingwood.part(10, 11),
  ]),
  new LineShapeEdge(station.HEATHERDALE, station.RINGWOOD, [
    routeGraph.heatherdaleToRingwood,
  ], [
    mapSegment.camberwellToRingwood.part(11, 11),
  ]),
  new LineShapeEdge(station.RINGWOOD, station.RINGWOOD_EAST, [
    routeGraph.ringwoodToRingwoodEast,
  ], [
    mapSegment.ringwoodToLilydale.part(1, 4),
  ]),
  new LineShapeEdge(station.RINGWOOD_EAST, station.CROYDON, [
    routeGraph.ringwoodEastToCroydon,
  ], [
    mapSegment.ringwoodToLilydale.part(2, 4),
  ]),
  new LineShapeEdge(station.CROYDON, station.MOOROOLBARK, [
    routeGraph.croydonToMooroolbark,
  ], [
    mapSegment.ringwoodToLilydale.part(3, 4),
  ]),
  new LineShapeEdge(station.MOOROOLBARK, station.LILYDALE, [
    routeGraph.mooroolbarkToLilydale,
  ], [
    mapSegment.ringwoodToLilydale.part(4, 4),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.LILYDALE,
  name: "Lilydale",
  ptvIds: [9],
  route,
  lineType: "suburban",
  group: group.BURNLEY,
});
