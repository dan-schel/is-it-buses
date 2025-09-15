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
  camberwellToRiversdale: new StationPair(station.CAMBERWELL, station.RIVERSDALE),
  riversdaleToWillison: new StationPair(station.RIVERSDALE, station.WILLISON),
  willisonToHartwell: new StationPair(station.WILLISON, station.HARTWELL),
  hartwellToBurwood: new StationPair(station.HARTWELL, station.BURWOOD),
  burwoodToAshburton: new StationPair(station.BURWOOD, station.ASHBURTON),
  ashburtonToAlamein: new StationPair(station.ASHBURTON, station.ALAMEIN),
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
  camberwellToAlamein: MapSegment.full(map.BURNLEY.CAMBERWELL, map.BURNLEY.ALAMEIN),
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
  new LineShapeEdge(station.CAMBERWELL, station.RIVERSDALE, [
    routeGraph.camberwellToRiversdale,
  ], [
    mapSegment.camberwellToAlamein.part(1, 6),
  ]),
  new LineShapeEdge(station.RIVERSDALE, station.WILLISON, [
    routeGraph.riversdaleToWillison,
  ], [
    mapSegment.camberwellToAlamein.part(2, 6),
  ]),
  new LineShapeEdge(station.WILLISON, station.HARTWELL, [
    routeGraph.willisonToHartwell,
  ], [
    mapSegment.camberwellToAlamein.part(3, 6),
  ]),
  new LineShapeEdge(station.HARTWELL, station.BURWOOD, [
    routeGraph.hartwellToBurwood,
  ], [
    mapSegment.camberwellToAlamein.part(4, 6),
  ]),
  new LineShapeEdge(station.BURWOOD, station.ASHBURTON, [
    routeGraph.burwoodToAshburton,
  ], [
    mapSegment.camberwellToAlamein.part(5, 6),
  ]),
  new LineShapeEdge(station.ASHBURTON, station.ALAMEIN, [
    routeGraph.ashburtonToAlamein,
  ], [
    mapSegment.camberwellToAlamein.part(6, 6),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.ALAMEIN,
  name: "Alamein",
  ptvIds: [1],
  route,
  lineType: "suburban",
  group: group.BURNLEY,
});
