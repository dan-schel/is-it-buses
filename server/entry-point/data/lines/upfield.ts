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
  northMelbourneToMacaulay: new StationPair(station.NORTH_MELBOURNE, station.MACAULAY),
  macaulayToFlemingtonBridge: new StationPair(station.MACAULAY, station.FLEMINGTON_BRIDGE),
  flemingtonBridgeToRoyalPark: new StationPair(station.FLEMINGTON_BRIDGE, station.ROYAL_PARK),
  royalParkToJewell: new StationPair(station.ROYAL_PARK, station.JEWELL),
  jewellToBrunswick: new StationPair(station.JEWELL, station.BRUNSWICK),
  brunswickToAnstey: new StationPair(station.BRUNSWICK, station.ANSTEY),
  ansteyToMoreland: new StationPair(station.ANSTEY, station.MORELAND),
  morelandToCoburg: new StationPair(station.MORELAND, station.COBURG),
  coburgToBatman: new StationPair(station.COBURG, station.BATMAN),
  batmanToMerlynston: new StationPair(station.BATMAN, station.MERLYNSTON),
  merlynstonToFawkner: new StationPair(station.MERLYNSTON, station.FAWKNER),
  fawknerToGowrie: new StationPair(station.FAWKNER, station.GOWRIE),
  gowrieToUpfield: new StationPair(station.GOWRIE, station.UPFIELD),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToSouthernCross: MapSegment.full(map.NORTHERN.FLINDERS_STREET_DIRECT, map.NORTHERN.SOUTHERN_CROSS),
  southernCrossToNorthMelbourne: MapSegment.full(map.NORTHERN.SOUTHERN_CROSS, map.NORTHERN.NORTH_MELBOURNE),
  northMelbourneToFlagstaff: MapSegment.full(map.NORTHERN.NORTH_MELBOURNE, map.NORTHERN.FLAGSTAFF),
  flagstaffToMelbourneCentral: MapSegment.full(map.NORTHERN.FLAGSTAFF, map.NORTHERN.MELBOURNE_CENTRAL),
  melbourneCentralToParliament: MapSegment.full(map.NORTHERN.MELBOURNE_CENTRAL, map.NORTHERN.PARLIAMENT),
  parliamentToFlindersStreet: MapSegment.full(map.NORTHERN.PARLIAMENT, map.NORTHERN.FLINDERS_STREET_LOOP),
  northMelbourneToUpfield: MapSegment.full(map.NORTHERN.NORTH_MELBOURNE, map.NORTHERN.UPFIELD),
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
  new LineShapeEdge(station.NORTH_MELBOURNE, station.MACAULAY, [
    routeGraph.northMelbourneToMacaulay,
  ], [
    mapSegment.northMelbourneToUpfield.part(1, 13),
  ]),
  new LineShapeEdge(station.MACAULAY, station.FLEMINGTON_BRIDGE, [
    routeGraph.macaulayToFlemingtonBridge,
  ], [
    mapSegment.northMelbourneToUpfield.part(2, 13),
  ]),
  new LineShapeEdge(station.FLEMINGTON_BRIDGE, station.ROYAL_PARK, [
    routeGraph.flemingtonBridgeToRoyalPark,
  ], [
    mapSegment.northMelbourneToUpfield.part(3, 13),
  ]),
  new LineShapeEdge(station.ROYAL_PARK, station.JEWELL, [
    routeGraph.royalParkToJewell,
  ], [
    mapSegment.northMelbourneToUpfield.part(4, 13),
  ]),
  new LineShapeEdge(station.JEWELL, station.BRUNSWICK, [
    routeGraph.jewellToBrunswick,
  ], [
    mapSegment.northMelbourneToUpfield.part(5, 13),
  ]),
  new LineShapeEdge(station.BRUNSWICK, station.ANSTEY, [
    routeGraph.brunswickToAnstey,
  ], [
    mapSegment.northMelbourneToUpfield.part(6, 13),
  ]),
  new LineShapeEdge(station.ANSTEY, station.MORELAND, [
    routeGraph.ansteyToMoreland,
  ], [
    mapSegment.northMelbourneToUpfield.part(7, 13),
  ]),
  new LineShapeEdge(station.MORELAND, station.COBURG, [
    routeGraph.morelandToCoburg,
  ], [
    mapSegment.northMelbourneToUpfield.part(8, 13),
  ]),
  new LineShapeEdge(station.COBURG, station.BATMAN, [
    routeGraph.coburgToBatman,
  ], [
    mapSegment.northMelbourneToUpfield.part(9, 13),
  ]),
  new LineShapeEdge(station.BATMAN, station.MERLYNSTON, [
    routeGraph.batmanToMerlynston,
  ], [
    mapSegment.northMelbourneToUpfield.part(10, 13),
  ]),
  new LineShapeEdge(station.MERLYNSTON, station.FAWKNER, [
    routeGraph.merlynstonToFawkner,
  ], [
    mapSegment.northMelbourneToUpfield.part(11, 13),
  ]),
  new LineShapeEdge(station.FAWKNER, station.GOWRIE, [
    routeGraph.fawknerToGowrie,
  ], [
    mapSegment.northMelbourneToUpfield.part(12, 13),
  ]),
  new LineShapeEdge(station.GOWRIE, station.UPFIELD, [
    routeGraph.gowrieToUpfield,
  ], [
    mapSegment.northMelbourneToUpfield.part(13, 13),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.UPFIELD,
  name: "Upfield",
  ptvIds: [15],
  route,
  lineType: "suburban",
  group: group.NORTHERN,
});
