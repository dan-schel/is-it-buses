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
  cliftonHillToWestgarth: new StationPair(station.CLIFTON_HILL, station.WESTGARTH),
  westgarthToDennis: new StationPair(station.WESTGARTH, station.DENNIS),
  dennisToFairfield: new StationPair(station.DENNIS, station.FAIRFIELD),
  fairfieldToAlphington: new StationPair(station.FAIRFIELD, station.ALPHINGTON),
  alphingtonToDarebin: new StationPair(station.ALPHINGTON, station.DAREBIN),
  darebinToIvanhoe: new StationPair(station.DAREBIN, station.IVANHOE),
  ivanhoeToEaglemont: new StationPair(station.IVANHOE, station.EAGLEMONT),
  eaglemontToHeidelberg: new StationPair(station.EAGLEMONT, station.HEIDELBERG),
  heidelbergToRosanna: new StationPair(station.HEIDELBERG, station.ROSANNA),
  rosannaToMacleod: new StationPair(station.ROSANNA, station.MACLEOD),
  macleodToWatsonia: new StationPair(station.MACLEOD, station.WATSONIA),
  watsoniaToGreensborough: new StationPair(station.WATSONIA, station.GREENSBOROUGH),
  greensboroughToMontmorency: new StationPair(station.GREENSBOROUGH, station.MONTMORENCY),
  montmorencyToEltham: new StationPair(station.MONTMORENCY, station.ELTHAM),
  elthamToDiamondCreek: new StationPair(station.ELTHAM, station.DIAMOND_CREEK),
  diamondCreekToWattleGlen: new StationPair(station.DIAMOND_CREEK, station.WATTLE_GLEN),
  wattleGlenToHurstbridge: new StationPair(station.WATTLE_GLEN, station.HURSTBRIDGE),
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
  cliftonHillToHurstbridge: MapSegment.full(map.CLIFTON_HILL.CLIFTON_HILL, map.CLIFTON_HILL.HURSTBRIDGE),
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
  new LineShapeEdge(station.CLIFTON_HILL, station.WESTGARTH, [
    routeGraph.cliftonHillToWestgarth,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(1, 17),
  ]),
  new LineShapeEdge(station.WESTGARTH, station.DENNIS, [
    routeGraph.westgarthToDennis,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(2, 17),
  ]),
  new LineShapeEdge(station.DENNIS, station.FAIRFIELD, [
    routeGraph.dennisToFairfield,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(3, 17),
  ]),
  new LineShapeEdge(station.FAIRFIELD, station.ALPHINGTON, [
    routeGraph.fairfieldToAlphington,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(4, 17),
  ]),
  new LineShapeEdge(station.ALPHINGTON, station.DAREBIN, [
    routeGraph.alphingtonToDarebin,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(5, 17),
  ]),
  new LineShapeEdge(station.DAREBIN, station.IVANHOE, [
    routeGraph.darebinToIvanhoe,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(6, 17),
  ]),
  new LineShapeEdge(station.IVANHOE, station.EAGLEMONT, [
    routeGraph.ivanhoeToEaglemont,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(7, 17),
  ]),
  new LineShapeEdge(station.EAGLEMONT, station.HEIDELBERG, [
    routeGraph.eaglemontToHeidelberg,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(8, 17),
  ]),
  new LineShapeEdge(station.HEIDELBERG, station.ROSANNA, [
    routeGraph.heidelbergToRosanna,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(9, 17),
  ]),
  new LineShapeEdge(station.ROSANNA, station.MACLEOD, [
    routeGraph.rosannaToMacleod,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(10, 17),
  ]),
  new LineShapeEdge(station.MACLEOD, station.WATSONIA, [
    routeGraph.macleodToWatsonia,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(11, 17),
  ]),
  new LineShapeEdge(station.WATSONIA, station.GREENSBOROUGH, [
    routeGraph.watsoniaToGreensborough,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(12, 17),
  ]),
  new LineShapeEdge(station.GREENSBOROUGH, station.MONTMORENCY, [
    routeGraph.greensboroughToMontmorency,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(13, 17),
  ]),
  new LineShapeEdge(station.MONTMORENCY, station.ELTHAM, [
    routeGraph.montmorencyToEltham,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(14, 17),
  ]),
  new LineShapeEdge(station.ELTHAM, station.DIAMOND_CREEK, [
    routeGraph.elthamToDiamondCreek,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(15, 17),
  ]),
  new LineShapeEdge(station.DIAMOND_CREEK, station.WATTLE_GLEN, [
    routeGraph.diamondCreekToWattleGlen,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(16, 17),
  ]),
  new LineShapeEdge(station.WATTLE_GLEN, station.HURSTBRIDGE, [
    routeGraph.wattleGlenToHurstbridge,
  ], [
    mapSegment.cliftonHillToHurstbridge.part(17, 17),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape("the-city", lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.HURSTBRIDGE,
  name: "Hurstbridge",
  ptvIds: [8],
  route,
  lineType: "suburban",
  group: group.CLIFTON_HILL,
});
