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
  richmondToSouthYarra: new StationPair(station.RICHMOND, station.SOUTH_YARRA),
  southYarraToPrahran: new StationPair(station.SOUTH_YARRA, station.PRAHRAN),
  prahranToWindsor: new StationPair(station.PRAHRAN, station.WINDSOR),
  windsorToBalaclava: new StationPair(station.WINDSOR, station.BALACLAVA),
  balaclavaToRipponlea: new StationPair(station.BALACLAVA, station.RIPPONLEA),
  ripponleaToElsternwick: new StationPair(station.RIPPONLEA, station.ELSTERNWICK),
  elsternwickToGardenvale: new StationPair(station.ELSTERNWICK, station.GARDENVALE),
  gardenvaleToNorthBrighton: new StationPair(station.GARDENVALE, station.NORTH_BRIGHTON),
  northBrightonToMiddleBrighton: new StationPair(station.NORTH_BRIGHTON, station.MIDDLE_BRIGHTON),
  middleBrightonToBrightonBeach: new StationPair(station.MIDDLE_BRIGHTON, station.BRIGHTON_BEACH),
  brightonBeachToHampton: new StationPair(station.BRIGHTON_BEACH, station.HAMPTON),
  hamptonToSandringham: new StationPair(station.HAMPTON, station.SANDRINGHAM),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToRichmond: MapSegment.full(map.SANDRINGHAM.FLINDERS_STREET, map.SANDRINGHAM.RICHMOND),
  richmondToSouthYarra: MapSegment.full(map.SANDRINGHAM.RICHMOND, map.SANDRINGHAM.SOUTH_YARRA),
  southYarraToSandringham: MapSegment.full(map.SANDRINGHAM.SOUTH_YARRA, map.SANDRINGHAM.SANDRINGHAM),
};

// prettier-ignore
const lineShapeEdges = [
  new LineShapeEdge(station.FLINDERS_STREET, station.RICHMOND, [
    routeGraph.flindersStreetToRichmond,
  ], [
    mapSegment.flindersStreetToRichmond,
  ]),
  new LineShapeEdge(station.RICHMOND, station.SOUTH_YARRA, [
    routeGraph.richmondToSouthYarra,
  ], [
    mapSegment.richmondToSouthYarra,
  ]),
  new LineShapeEdge(station.SOUTH_YARRA, station.PRAHRAN, [
    routeGraph.southYarraToPrahran,
  ], [
    mapSegment.southYarraToSandringham.part(1, 11),
  ]),
  new LineShapeEdge(station.PRAHRAN, station.WINDSOR, [
    routeGraph.prahranToWindsor,
  ], [
    mapSegment.southYarraToSandringham.part(2, 11),
  ]),
  new LineShapeEdge(station.WINDSOR, station.BALACLAVA, [
    routeGraph.windsorToBalaclava,
  ], [
    mapSegment.southYarraToSandringham.part(3, 11),
  ]),
  new LineShapeEdge(station.BALACLAVA, station.RIPPONLEA, [
    routeGraph.balaclavaToRipponlea,
  ], [
    mapSegment.southYarraToSandringham.part(4, 11),
  ]),
  new LineShapeEdge(station.RIPPONLEA, station.ELSTERNWICK, [
    routeGraph.ripponleaToElsternwick,
  ], [
    mapSegment.southYarraToSandringham.part(5, 11),
  ]),
  new LineShapeEdge(station.ELSTERNWICK, station.GARDENVALE, [
    routeGraph.elsternwickToGardenvale,
  ], [
    mapSegment.southYarraToSandringham.part(6, 11),
  ]),
  new LineShapeEdge(station.GARDENVALE, station.NORTH_BRIGHTON, [
    routeGraph.gardenvaleToNorthBrighton,
  ], [
    mapSegment.southYarraToSandringham.part(7, 11),
  ]),
  new LineShapeEdge(station.NORTH_BRIGHTON, station.MIDDLE_BRIGHTON, [
    routeGraph.northBrightonToMiddleBrighton,
  ], [
    mapSegment.southYarraToSandringham.part(8, 11),
  ]),
  new LineShapeEdge(station.MIDDLE_BRIGHTON, station.BRIGHTON_BEACH, [
    routeGraph.middleBrightonToBrightonBeach,
  ], [
    mapSegment.southYarraToSandringham.part(9, 11),
  ]),
  new LineShapeEdge(station.BRIGHTON_BEACH, station.HAMPTON, [
    routeGraph.brightonBeachToHampton,
  ], [
    mapSegment.southYarraToSandringham.part(10, 11),
  ]),
  new LineShapeEdge(station.HAMPTON, station.SANDRINGHAM, [
    routeGraph.hamptonToSandringham,
  ], [
    mapSegment.southYarraToSandringham.part(11, 11),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.FLINDERS_STREET, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.SANDRINGHAM,
  name: "Sandringham",
  ptvIds: [12],
  route,
  lineType: "suburban",
  group: group.SANDRINGHAM,
});
