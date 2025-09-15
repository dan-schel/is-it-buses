import * as id from "@/shared/line-ids";
import * as station from "@/shared/station-ids";
import * as group from "@/server/entry-point/data/groups";
import { Line } from "@/server/data/line/line";
import { StationPair } from "@/server/data/line/line-routes/station-pair";
import {
  LineShape,
  LineShapeEdge,
} from "@/server/data/line/line-routes/line-shape";
import { LineRoute } from "@/server/data/line/line-routes/line-route";

// prettier-ignore
const routeGraph = {
  flindersStreetToSouthernCross: new StationPair(station.FLINDERS_STREET, station.SOUTHERN_CROSS),
  southernCrossToNorthMelbourne: new StationPair(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE),
  northMelbourneToShowgrounds: new StationPair(station.NORTH_MELBOURNE, station.SHOWGROUNDS),
  showgroundsToFlemingtonRacecourse: new StationPair(station.SHOWGROUNDS, station.FLEMINGTON_RACECOURSE),
};

// NODE: The Flemington Racecourse line is currently not represented on the map.

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.FLINDERS_STREET, station.SOUTHERN_CROSS, [
    routeGraph.flindersStreetToSouthernCross,
  ], []),
  new LineShapeEdge(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE, [
    routeGraph.southernCrossToNorthMelbourne,
  ], []),
  new LineShapeEdge(station.NORTH_MELBOURNE, station.SHOWGROUNDS, [
    routeGraph.northMelbourneToShowgrounds,
  ], []),
  new LineShapeEdge(station.SHOWGROUNDS, station.FLEMINGTON_RACECOURSE, [
    routeGraph.showgroundsToFlemingtonRacecourse,
  ], []),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.FLINDERS_STREET, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.FLEMINGTON_RACECOURSE,
  name: "Flemington Racecourse",
  ptvIds: [1482],
  route,
  lineType: "suburban",
  group: group.FLEMINGTON_RACECOURSE,
});
