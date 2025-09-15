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
  burnleyToHeyington: new StationPair(station.BURNLEY, station.HEYINGTON),
  heyingtonToKooyong: new StationPair(station.HEYINGTON, station.KOOYONG),
  kooyongToTooronga: new StationPair(station.KOOYONG, station.TOORONGA),
  toorongaToGardiner: new StationPair(station.TOORONGA, station.GARDINER),
  gardinerToGlenIris: new StationPair(station.GARDINER, station.GLEN_IRIS),
  glenIrisToDarling: new StationPair(station.GLEN_IRIS, station.DARLING),
  darlingToEastMalvern: new StationPair(station.DARLING, station.EAST_MALVERN),
  eastMalvernToHolmesglen: new StationPair(station.EAST_MALVERN, station.HOLMESGLEN),
  holmesglenToJordanville: new StationPair(station.HOLMESGLEN, station.JORDANVILLE),
  jordanvilleToMountWaverley: new StationPair(station.JORDANVILLE, station.MOUNT_WAVERLEY),
  mountWaverleyToSyndal: new StationPair(station.MOUNT_WAVERLEY, station.SYNDAL),
  syndalToGlenWaverley: new StationPair(station.SYNDAL, station.GLEN_WAVERLEY),
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
  burnleyToGlenWaverley: MapSegment.full(map.BURNLEY.BURNLEY, map.BURNLEY.GLEN_WAVERLEY),
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
  new LineShapeEdge(station.BURNLEY, station.HEYINGTON, [
    routeGraph.burnleyToHeyington,
  ], [
    mapSegment.burnleyToGlenWaverley.part(1, 12),
  ]),
  new LineShapeEdge(station.HEYINGTON, station.KOOYONG, [
    routeGraph.heyingtonToKooyong,
  ], [
    mapSegment.burnleyToGlenWaverley.part(2, 12),
  ]),
  new LineShapeEdge(station.KOOYONG, station.TOORONGA, [
    routeGraph.kooyongToTooronga,
  ], [
    mapSegment.burnleyToGlenWaverley.part(3, 12),
  ]),
  new LineShapeEdge(station.TOORONGA, station.GARDINER, [
    routeGraph.toorongaToGardiner,
  ], [
    mapSegment.burnleyToGlenWaverley.part(4, 12),
  ]),
  new LineShapeEdge(station.GARDINER, station.GLEN_IRIS, [
    routeGraph.gardinerToGlenIris,
  ], [
    mapSegment.burnleyToGlenWaverley.part(5, 12),
  ]),
  new LineShapeEdge(station.GLEN_IRIS, station.DARLING, [
    routeGraph.glenIrisToDarling,
  ], [
    mapSegment.burnleyToGlenWaverley.part(6, 12),
  ]),
  new LineShapeEdge(station.DARLING, station.EAST_MALVERN, [
    routeGraph.darlingToEastMalvern,
  ], [
    mapSegment.burnleyToGlenWaverley.part(7, 12),
  ]),
  new LineShapeEdge(station.EAST_MALVERN, station.HOLMESGLEN, [
    routeGraph.eastMalvernToHolmesglen,
  ], [
    mapSegment.burnleyToGlenWaverley.part(8, 12),
  ]),
  new LineShapeEdge(station.HOLMESGLEN, station.JORDANVILLE, [
    routeGraph.holmesglenToJordanville,
  ], [
    mapSegment.burnleyToGlenWaverley.part(9, 12),
  ]),
  new LineShapeEdge(station.JORDANVILLE, station.MOUNT_WAVERLEY, [
    routeGraph.jordanvilleToMountWaverley,
  ], [
    mapSegment.burnleyToGlenWaverley.part(10, 12),
  ]),
  new LineShapeEdge(station.MOUNT_WAVERLEY, station.SYNDAL, [
    routeGraph.mountWaverleyToSyndal,
  ], [
    mapSegment.burnleyToGlenWaverley.part(11, 12),
  ]),
  new LineShapeEdge(station.SYNDAL, station.GLEN_WAVERLEY, [
    routeGraph.syndalToGlenWaverley,
  ], [
    mapSegment.burnleyToGlenWaverley.part(12, 12),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.GLEN_WAVERLEY,
  name: "Glen Waverley",
  ptvIds: [7],
  route,
  lineType: "suburban",
  group: group.BURNLEY,
});
