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
  flindersStreetToJolimont: new StationPair(station.FLINDERS_STREET, station.JOLIMONT),
  flindersStreetToSouthernCross: new StationPair(station.FLINDERS_STREET, station.SOUTHERN_CROSS),
  southernCrossToFlagstaff: new StationPair(station.SOUTHERN_CROSS, station.FLAGSTAFF),
  flagstaffToMelbourneCentral: new StationPair(station.FLAGSTAFF, station.MELBOURNE_CENTRAL),
  melbourneCentralToParliament: new StationPair(station.MELBOURNE_CENTRAL, station.PARLIAMENT),
  parliamentToJolimont: new StationPair(station.PARLIAMENT, station.JOLIMONT),
  jolimontToWestRichmond: new StationPair(station.JOLIMONT, station.WEST_RICHMOND),
  westRichmondToNorthRichmond: new StationPair(station.WEST_RICHMOND, station.NORTH_RICHMOND),
  northRichmondToCollingwood: new StationPair(station.NORTH_RICHMOND, station.COLLINGWOOD),
  collingwoodToVictoriaPark: new StationPair(station.COLLINGWOOD, station.VICTORIA_PARK),
  victoriaParkToCliftonHill: new StationPair(station.VICTORIA_PARK, station.CLIFTON_HILL),
  cliftonHillToRushall: new StationPair(station.CLIFTON_HILL, station.RUSHALL),
  rushallToMerri: new StationPair(station.RUSHALL, station.MERRI),
  merriToNorthcote: new StationPair(station.MERRI, station.NORTHCOTE),
  northcoteToCroxton: new StationPair(station.NORTHCOTE, station.CROXTON),
  croxtonToThornbury: new StationPair(station.CROXTON, station.THORNBURY),
  thornburyToBell: new StationPair(station.THORNBURY, station.BELL),
  bellToPreston: new StationPair(station.BELL, station.PRESTON),
  prestonToRegent: new StationPair(station.PRESTON, station.REGENT),
  regentToReservoir: new StationPair(station.REGENT, station.RESERVOIR),
  reservoirToRuthven: new StationPair(station.RESERVOIR, station.RUTHVEN),
  ruthvenToKeonPark: new StationPair(station.RUTHVEN, station.KEON_PARK),
  keonParkToThomastown: new StationPair(station.KEON_PARK, station.THOMASTOWN),
  thomastownToLalor: new StationPair(station.THOMASTOWN, station.LALOR),
  lalorToEpping: new StationPair(station.LALOR, station.EPPING),
  eppingToSouthMorang: new StationPair(station.EPPING, station.SOUTH_MORANG),
  southMorangToMiddleGorge: new StationPair(station.SOUTH_MORANG, station.MIDDLE_GORGE),
  middleGorgeToHawkstowe: new StationPair(station.MIDDLE_GORGE, station.HAWKSTOWE),
  hawkstoweToMernda: new StationPair(station.HAWKSTOWE, station.MERNDA),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToJolimont: MapSegment.full(map.CLIFTON_HILL.FLINDERS_STREET_DIRECT, map.CLIFTON_HILL.JOLIMONT),
  flindersStreetToSouthernCross: MapSegment.full(map.CLIFTON_HILL.FLINDERS_STREET_LOOP, map.CLIFTON_HILL.SOUTHERN_CROSS),
  southernCrossToFlagstaff: MapSegment.full(map.CLIFTON_HILL.SOUTHERN_CROSS, map.CLIFTON_HILL.FLAGSTAFF),
  flagstaffToMelbourneCentral: MapSegment.full(map.CLIFTON_HILL.FLAGSTAFF, map.CLIFTON_HILL.MELBOURNE_CENTRAL),
  melbourneCentralToParliament: MapSegment.full(map.CLIFTON_HILL.MELBOURNE_CENTRAL, map.CLIFTON_HILL.PARLIAMENT),
  parliamentToJolimont: MapSegment.full(map.CLIFTON_HILL.PARLIAMENT, map.CLIFTON_HILL.JOLIMONT),
  jolimontToCliftonHill: MapSegment.full(map.CLIFTON_HILL.JOLIMONT, map.CLIFTON_HILL.CLIFTON_HILL),
  cliftonHillToMernda: MapSegment.full(map.CLIFTON_HILL.CLIFTON_HILL, map.CLIFTON_HILL.MERNDA),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge("the-city", station.JOLIMONT, [
    routeGraph.flindersStreetToJolimont,
    routeGraph.flindersStreetToSouthernCross,
    routeGraph.southernCrossToFlagstaff,
    routeGraph.flagstaffToMelbourneCentral,
    routeGraph.melbourneCentralToParliament,
    routeGraph.parliamentToJolimont,
  ], [
    mapSegment.flindersStreetToJolimont,
    mapSegment.flindersStreetToSouthernCross,
    mapSegment.southernCrossToFlagstaff,
    mapSegment.flagstaffToMelbourneCentral,
    mapSegment.melbourneCentralToParliament,
    mapSegment.parliamentToJolimont,
  ]),
  new LineShapeEdge(station.JOLIMONT, station.WEST_RICHMOND, [
    routeGraph.jolimontToWestRichmond,
  ], [
    mapSegment.jolimontToCliftonHill.part(1, 5),
  ]),
  new LineShapeEdge(station.WEST_RICHMOND, station.NORTH_RICHMOND, [
    routeGraph.westRichmondToNorthRichmond,
  ], [
    mapSegment.jolimontToCliftonHill.part(2, 5),
  ]),
  new LineShapeEdge(station.NORTH_RICHMOND, station.COLLINGWOOD, [
    routeGraph.northRichmondToCollingwood,
  ], [
    mapSegment.jolimontToCliftonHill.part(3, 5),
  ]),
  new LineShapeEdge(station.COLLINGWOOD, station.VICTORIA_PARK, [
    routeGraph.collingwoodToVictoriaPark,
  ], [
    mapSegment.jolimontToCliftonHill.part(4, 5),
  ]),
  new LineShapeEdge(station.VICTORIA_PARK, station.CLIFTON_HILL, [
    routeGraph.victoriaParkToCliftonHill,
  ], [
    mapSegment.jolimontToCliftonHill.part(5, 5),
  ]),
  new LineShapeEdge(station.CLIFTON_HILL, station.RUSHALL, [
    routeGraph.cliftonHillToRushall,
  ], [
    mapSegment.cliftonHillToMernda.part(1, 18),
  ]),
  new LineShapeEdge(station.RUSHALL, station.MERRI, [
    routeGraph.rushallToMerri,
  ], [
    mapSegment.cliftonHillToMernda.part(2, 18),
  ]),
  new LineShapeEdge(station.MERRI, station.NORTHCOTE, [
    routeGraph.merriToNorthcote,
  ], [
    mapSegment.cliftonHillToMernda.part(3, 18),
  ]),
  new LineShapeEdge(station.NORTHCOTE, station.CROXTON, [
    routeGraph.northcoteToCroxton,
  ], [
    mapSegment.cliftonHillToMernda.part(4, 18),
  ]),
  new LineShapeEdge(station.CROXTON, station.THORNBURY, [
    routeGraph.croxtonToThornbury,
  ], [
    mapSegment.cliftonHillToMernda.part(5, 18),
  ]),
  new LineShapeEdge(station.THORNBURY, station.BELL, [
    routeGraph.thornburyToBell,
  ], [
    mapSegment.cliftonHillToMernda.part(6, 18),
  ]),
  new LineShapeEdge(station.BELL, station.PRESTON, [
    routeGraph.bellToPreston,
  ], [
    mapSegment.cliftonHillToMernda.part(7, 18),
  ]),
  new LineShapeEdge(station.PRESTON, station.REGENT, [
    routeGraph.prestonToRegent,
  ], [
    mapSegment.cliftonHillToMernda.part(8, 18),
  ]),
  new LineShapeEdge(station.REGENT, station.RESERVOIR, [
    routeGraph.regentToReservoir,
  ], [
    mapSegment.cliftonHillToMernda.part(9, 18),
  ]),
  new LineShapeEdge(station.RESERVOIR, station.RUTHVEN, [
    routeGraph.reservoirToRuthven,
  ], [
    mapSegment.cliftonHillToMernda.part(10, 18),
  ]),
  new LineShapeEdge(station.RUTHVEN, station.KEON_PARK, [
    routeGraph.ruthvenToKeonPark,
  ], [
    mapSegment.cliftonHillToMernda.part(11, 18),
  ]),
  new LineShapeEdge(station.KEON_PARK, station.THOMASTOWN, [
    routeGraph.keonParkToThomastown,
  ], [
    mapSegment.cliftonHillToMernda.part(12, 18),
  ]),
  new LineShapeEdge(station.THOMASTOWN, station.LALOR, [
    routeGraph.thomastownToLalor,
  ], [
    mapSegment.cliftonHillToMernda.part(13, 18),
  ]),
  new LineShapeEdge(station.LALOR, station.EPPING, [
    routeGraph.lalorToEpping,
  ], [
    mapSegment.cliftonHillToMernda.part(14, 18),
  ]),
  new LineShapeEdge(station.EPPING, station.SOUTH_MORANG, [
    routeGraph.eppingToSouthMorang,
  ], [
    mapSegment.cliftonHillToMernda.part(15, 18),
  ]),
  new LineShapeEdge(station.SOUTH_MORANG, station.MIDDLE_GORGE, [
    routeGraph.southMorangToMiddleGorge,
  ], [
    mapSegment.cliftonHillToMernda.part(16, 18),
  ]),
  new LineShapeEdge(station.MIDDLE_GORGE, station.HAWKSTOWE, [
    routeGraph.middleGorgeToHawkstowe,
  ], [
    mapSegment.cliftonHillToMernda.part(17, 18),
  ]),
  new LineShapeEdge(station.HAWKSTOWE, station.MERNDA, [
    routeGraph.hawkstoweToMernda,
  ], [
    mapSegment.cliftonHillToMernda.part(18, 18),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.MERNDA,
  name: "Mernda",
  ptvIds: [5],
  route,
  lineType: "suburban",
  group: group.CLIFTON_HILL,
});
