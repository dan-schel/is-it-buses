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
  frankstonToLeawarra: new StationPair(station.FRANKSTON, station.LEAWARRA),
  leawarraToBaxter: new StationPair(station.LEAWARRA, station.BAXTER),
  baxterToSomerville: new StationPair(station.BAXTER, station.SOMERVILLE),
  somervilleToTyabb: new StationPair(station.SOMERVILLE, station.TYABB),
  tyabbToHastings: new StationPair(station.TYABB, station.HASTINGS),
  hastingsToBittern: new StationPair(station.HASTINGS, station.BITTERN),
  bitternToMorradoo: new StationPair(station.BITTERN, station.MORRADOO),
  morradooToCribPoint: new StationPair(station.MORRADOO, station.CRIB_POINT),
  cribPointToStonyPoint: new StationPair(station.CRIB_POINT, station.STONY_POINT),
};

// prettier-ignore
const mapSegment = {
  frankstonToStonyPoint: MapSegment.full(map.STONY_POINT.FRANKSTON, map.STONY_POINT.STONY_POINT),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.FRANKSTON, station.LEAWARRA, [
    routeGraph.frankstonToLeawarra,
  ], [
    mapSegment.frankstonToStonyPoint.part(1, 9),
  ]),
  new LineShapeEdge(station.LEAWARRA, station.BAXTER, [
    routeGraph.leawarraToBaxter,
  ], [
    mapSegment.frankstonToStonyPoint.part(2, 9),
  ]),
  new LineShapeEdge(station.BAXTER, station.SOMERVILLE, [
    routeGraph.baxterToSomerville,
  ], [
    mapSegment.frankstonToStonyPoint.part(3, 9),
  ]),
  new LineShapeEdge(station.SOMERVILLE, station.TYABB, [
    routeGraph.somervilleToTyabb,
  ], [
    mapSegment.frankstonToStonyPoint.part(4, 9),
  ]),
  new LineShapeEdge(station.TYABB, station.HASTINGS, [
    routeGraph.tyabbToHastings,
  ], [
    mapSegment.frankstonToStonyPoint.part(5, 9),
  ]),
  new LineShapeEdge(station.HASTINGS, station.BITTERN, [
    routeGraph.hastingsToBittern,
  ], [
    mapSegment.frankstonToStonyPoint.part(6, 9),
  ]),
  new LineShapeEdge(station.BITTERN, station.MORRADOO, [
    routeGraph.bitternToMorradoo,
  ], [
    mapSegment.frankstonToStonyPoint.part(7, 9),
  ]),
  new LineShapeEdge(station.MORRADOO, station.CRIB_POINT, [
    routeGraph.morradooToCribPoint,
  ], [
    mapSegment.frankstonToStonyPoint.part(8, 9),
  ]),
  new LineShapeEdge(station.CRIB_POINT, station.STONY_POINT, [
    routeGraph.cribPointToStonyPoint,
  ], [
    mapSegment.frankstonToStonyPoint.part(9, 9),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.FRANKSTON, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.STONY_POINT,
  name: "Stony Point",
  ptvIds: [13],
  route,
  lineType: "suburban",
  group: group.STONY_POINT,
});
