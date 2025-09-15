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
  flindersStreetToSouthernCross: new StationPair(station.FLINDERS_STREET, station.SOUTHERN_CROSS),
  southernCrossToNorthMelbourne: new StationPair(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE),
  northMelbourneToSouthKensington: new StationPair(station.NORTH_MELBOURNE, station.SOUTH_KENSINGTON),
  southKensingtonToFootscray: new StationPair(station.SOUTH_KENSINGTON, station.FOOTSCRAY),
  footscrayToSeddon: new StationPair(station.FOOTSCRAY, station.SEDDON),
  seddonToYarraville: new StationPair(station.SEDDON, station.YARRAVILLE),
  yarravilleToSpotswood: new StationPair(station.YARRAVILLE, station.SPOTSWOOD),
  spotswoodToNewport: new StationPair(station.SPOTSWOOD, station.NEWPORT),
  newportToNorthWilliamstown: new StationPair(station.NEWPORT, station.NORTH_WILLIAMSTOWN),
  northWilliamstownToWilliamstownBeach: new StationPair(station.NORTH_WILLIAMSTOWN, station.WILLIAMSTOWN_BEACH),
  williamstownBeachToWilliamstown: new StationPair(station.WILLIAMSTOWN_BEACH, station.WILLIAMSTOWN),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToSouthernCross: MapSegment.full(map.NEWPORT.FLINDERS_STREET, map.NEWPORT.SOUTHERN_CROSS),
  southernCrossToNorthMelbourne: MapSegment.full(map.NEWPORT.SOUTHERN_CROSS, map.NEWPORT.NORTH_MELBOURNE),
  northMelbourneToFootscray: MapSegment.full(map.NEWPORT.NORTH_MELBOURNE, map.NEWPORT.FOOTSCRAY),
  footscrayToNewport: MapSegment.full(map.NEWPORT.FOOTSCRAY, map.NEWPORT.NEWPORT),
  newportToWilliamstown: MapSegment.full(map.NEWPORT.NEWPORT, map.NEWPORT.WILLIAMSTOWN),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.FLINDERS_STREET, station.SOUTHERN_CROSS, [
    routeGraph.flindersStreetToSouthernCross,
  ], [
    mapSegment.flindersStreetToSouthernCross,
  ]),
  new LineShapeEdge(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE, [
    routeGraph.southernCrossToNorthMelbourne,
  ], [
    mapSegment.southernCrossToNorthMelbourne,
  ]),
  new LineShapeEdge(station.NORTH_MELBOURNE, station.SOUTH_KENSINGTON, [
    routeGraph.northMelbourneToSouthKensington,
  ], [
    mapSegment.northMelbourneToFootscray.part(1, 2),
  ]),
  new LineShapeEdge(station.SOUTH_KENSINGTON, station.FOOTSCRAY, [
    routeGraph.southKensingtonToFootscray,
  ], [
    mapSegment.northMelbourneToFootscray.part(2, 2),
  ]),
  new LineShapeEdge(station.FOOTSCRAY, station.SEDDON, [
    routeGraph.footscrayToSeddon,
  ], [
    mapSegment.footscrayToNewport.part(1, 4),
  ]),
  new LineShapeEdge(station.SEDDON, station.YARRAVILLE, [
    routeGraph.seddonToYarraville,
  ], [
    mapSegment.footscrayToNewport.part(2, 4),
  ]),
  new LineShapeEdge(station.YARRAVILLE, station.SPOTSWOOD, [
    routeGraph.yarravilleToSpotswood,
  ], [
    mapSegment.footscrayToNewport.part(3, 4),
  ]),
  new LineShapeEdge(station.SPOTSWOOD, station.NEWPORT, [
    routeGraph.spotswoodToNewport,
  ], [
    mapSegment.footscrayToNewport.part(4, 4),
  ]),
  new LineShapeEdge(station.NEWPORT, station.NORTH_WILLIAMSTOWN, [
    routeGraph.newportToNorthWilliamstown,
  ], [
    mapSegment.newportToWilliamstown.part(1, 3),
  ]),
  new LineShapeEdge(station.NORTH_WILLIAMSTOWN, station.WILLIAMSTOWN_BEACH, [
    routeGraph.northWilliamstownToWilliamstownBeach,
  ], [
    mapSegment.newportToWilliamstown.part(2, 3),
  ]),
  new LineShapeEdge(station.WILLIAMSTOWN_BEACH, station.WILLIAMSTOWN, [
    routeGraph.williamstownBeachToWilliamstown,
  ], [
    mapSegment.newportToWilliamstown.part(3, 3),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.FLINDERS_STREET, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.WILLIAMSTOWN,
  name: "Williamstown",
  ptvIds: [17],
  route,
  lineType: "suburban",
  group: group.NEWPORT,
});
