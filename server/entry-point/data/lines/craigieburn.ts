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
  flindersStreetToParliament: new StationPair(station.FLINDERS_STREET, station.PARLIAMENT),
  parliamentToMelbourneCentral: new StationPair(station.PARLIAMENT, station.MELBOURNE_CENTRAL),
  melbourneCentralToFlagstaff: new StationPair(station.MELBOURNE_CENTRAL, station.FLAGSTAFF),
  flagstaffToNorthMelbourne: new StationPair(station.FLAGSTAFF, station.NORTH_MELBOURNE),
  northMelbourneToKensington: new StationPair(station.NORTH_MELBOURNE, station.KENSINGTON),
  kensingtonToNewmarket: new StationPair(station.KENSINGTON, station.NEWMARKET),
  newmarketToAscotVale: new StationPair(station.NEWMARKET, station.ASCOT_VALE),
  ascotValeToMooneePonds: new StationPair(station.ASCOT_VALE, station.MOONEE_PONDS),
  mooneePondsToEssendon: new StationPair(station.MOONEE_PONDS, station.ESSENDON),
  essendonToGlenbervie: new StationPair(station.ESSENDON, station.GLENBERVIE),
  glenbervieToStrathmore: new StationPair(station.GLENBERVIE, station.STRATHMORE),
  strathmoreToPascoeVale: new StationPair(station.STRATHMORE, station.PASCOE_VALE),
  pascoeValeToOakPark: new StationPair(station.PASCOE_VALE, station.OAK_PARK),
  oakParkToGlenroy: new StationPair(station.OAK_PARK, station.GLENROY),
  glenroyToJacana: new StationPair(station.GLENROY, station.JACANA),
  jacanaToBroadmeadows: new StationPair(station.JACANA, station.BROADMEADOWS),
  broadmeadowsToCoolaroo: new StationPair(station.BROADMEADOWS, station.COOLAROO),
  coolarooToRoxburghPark: new StationPair(station.COOLAROO, station.ROXBURGH_PARK),
  roxburghParkToCraigieburn: new StationPair(station.ROXBURGH_PARK, station.CRAIGIEBURN),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToSouthernCross: MapSegment.full(map.NORTHERN.FLINDERS_STREET_DIRECT, map.NORTHERN.SOUTHERN_CROSS),
  southernCrossToNorthMelbourne: MapSegment.full(map.NORTHERN.SOUTHERN_CROSS, map.NORTHERN.NORTH_MELBOURNE),
  northMelbourneToFlagstaff: MapSegment.full(map.NORTHERN.NORTH_MELBOURNE, map.NORTHERN.FLAGSTAFF),
  flagstaffToMelbourneCentral: MapSegment.full(map.NORTHERN.FLAGSTAFF, map.NORTHERN.MELBOURNE_CENTRAL),
  melbourneCentralToParliament: MapSegment.full(map.NORTHERN.MELBOURNE_CENTRAL, map.NORTHERN.PARLIAMENT),
  parliamentToFlindersStreet: MapSegment.full(map.NORTHERN.PARLIAMENT, map.NORTHERN.FLINDERS_STREET_LOOP),
  northMelbourneToBroadmeadows: MapSegment.full(map.NORTHERN.NORTH_MELBOURNE, map.NORTHERN.BROADMEADOWS),
  broadmeadowsToCraigieburn: MapSegment.full(map.NORTHERN.BROADMEADOWS, map.NORTHERN.CRAIGIEBURN),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge("the-city", station.NORTH_MELBOURNE, [
    routeGraph.flindersStreetToSouthernCross,
    routeGraph.southernCrossToNorthMelbourne,
    routeGraph.flindersStreetToParliament,
    routeGraph.parliamentToMelbourneCentral,
    routeGraph.melbourneCentralToFlagstaff,
    routeGraph.flagstaffToNorthMelbourne,
  ], [
    mapSegment.flindersStreetToSouthernCross,
    mapSegment.southernCrossToNorthMelbourne,
    mapSegment.northMelbourneToFlagstaff,
    mapSegment.flagstaffToMelbourneCentral,
    mapSegment.melbourneCentralToParliament,
    mapSegment.parliamentToFlindersStreet,
  ]),
  new LineShapeEdge(station.NORTH_MELBOURNE, station.KENSINGTON, [
    routeGraph.northMelbourneToKensington,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(1, 12),
  ]),
  new LineShapeEdge(station.KENSINGTON, station.NEWMARKET, [
    routeGraph.kensingtonToNewmarket,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(2, 12),
  ]),
  new LineShapeEdge(station.NEWMARKET, station.ASCOT_VALE, [
    routeGraph.newmarketToAscotVale,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(3, 12),
  ]),
  new LineShapeEdge(station.ASCOT_VALE, station.MOONEE_PONDS, [
    routeGraph.ascotValeToMooneePonds,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(4, 12),
  ]),
  new LineShapeEdge(station.MOONEE_PONDS, station.ESSENDON, [
    routeGraph.mooneePondsToEssendon,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(5, 12),
  ]),
  new LineShapeEdge(station.ESSENDON, station.GLENBERVIE, [
    routeGraph.essendonToGlenbervie,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(6, 12),
  ]),
  new LineShapeEdge(station.GLENBERVIE, station.STRATHMORE, [
    routeGraph.glenbervieToStrathmore,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(7, 12),
  ]),
  new LineShapeEdge(station.STRATHMORE, station.PASCOE_VALE, [
    routeGraph.strathmoreToPascoeVale,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(8, 12),
  ]),
  new LineShapeEdge(station.PASCOE_VALE, station.OAK_PARK, [
    routeGraph.pascoeValeToOakPark,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(9, 12),
  ]),
  new LineShapeEdge(station.OAK_PARK, station.GLENROY, [
    routeGraph.oakParkToGlenroy,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(10, 12),
  ]),
  new LineShapeEdge(station.GLENROY, station.JACANA, [
    routeGraph.glenroyToJacana,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(11, 12),
  ]),
  new LineShapeEdge(station.JACANA, station.BROADMEADOWS, [
    routeGraph.jacanaToBroadmeadows,
  ], [
    mapSegment.northMelbourneToBroadmeadows.part(12, 12),
  ]),
  new LineShapeEdge(station.BROADMEADOWS, station.COOLAROO, [
    routeGraph.broadmeadowsToCoolaroo,
  ], [
    mapSegment.broadmeadowsToCraigieburn.part(1, 3),
  ]),
  new LineShapeEdge(station.COOLAROO, station.ROXBURGH_PARK, [
    routeGraph.coolarooToRoxburghPark,
  ], [
    mapSegment.broadmeadowsToCraigieburn.part(2, 3),
  ]),
  new LineShapeEdge(station.ROXBURGH_PARK, station.CRAIGIEBURN, [
    routeGraph.roxburghParkToCraigieburn,
  ], [
    mapSegment.broadmeadowsToCraigieburn.part(3, 3),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.CRAIGIEBURN,
  name: "Craigieburn",
  ptvIds: [3],
  route,
  lineType: "suburban",
  group: group.NORTHERN,
});
