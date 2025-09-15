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
  southYarraToHawksburn: new StationPair(station.SOUTH_YARRA, station.HAWKSBURN),
  hawksburnToToorak: new StationPair(station.HAWKSBURN, station.TOORAK),
  toorakToArmadale: new StationPair(station.TOORAK, station.ARMADALE),
  armadaleToMalvern: new StationPair(station.ARMADALE, station.MALVERN),
  malvernToCaulfield: new StationPair(station.MALVERN, station.CAULFIELD),
  caulfieldToGlenHuntly: new StationPair(station.CAULFIELD, station.GLEN_HUNTLY),
  glenHuntlyToOrmond: new StationPair(station.GLEN_HUNTLY, station.ORMOND),
  ormondToMcKinnon: new StationPair(station.ORMOND, station.MCKINNON),
  mcKinnonToBentleigh: new StationPair(station.MCKINNON, station.BENTLEIGH),
  bentleighToPatterson: new StationPair(station.BENTLEIGH, station.PATTERSON),
  pattersonToMoorabbin: new StationPair(station.PATTERSON, station.MOORABBIN),
  moorabbinToHighett: new StationPair(station.MOORABBIN, station.HIGHETT),
  highettToSouthland: new StationPair(station.HIGHETT, station.SOUTHLAND),
  southlandToCheltenham: new StationPair(station.SOUTHLAND, station.CHELTENHAM),
  cheltenhamToMentone: new StationPair(station.CHELTENHAM, station.MENTONE),
  mentoneToParkdale: new StationPair(station.MENTONE, station.PARKDALE),
  parkdaleToMordialloc: new StationPair(station.PARKDALE, station.MORDIALLOC),
  mordiallocToAspendale: new StationPair(station.MORDIALLOC, station.ASPENDALE),
  aspendaleToEdithvale: new StationPair(station.ASPENDALE, station.EDITHVALE),
  edithvaleToChelsea: new StationPair(station.EDITHVALE, station.CHELSEA),
  chelseaToBonbeach: new StationPair(station.CHELSEA, station.BONBEACH),
  bonbeachToCarrum: new StationPair(station.BONBEACH, station.CARRUM),
  carrumToSeaford: new StationPair(station.CARRUM, station.SEAFORD),
  seafordToKananook: new StationPair(station.SEAFORD, station.KANANOOK),
  kananookToFrankston: new StationPair(station.KANANOOK, station.FRANKSTON),
};

// prettier-ignore
const mapSegment = {
  flindersStreetToRichmond: MapSegment.full(map.FRANKSTON.FLINDERS_STREET, map.FRANKSTON.RICHMOND),
  richmondToSouthYarra: MapSegment.full(map.FRANKSTON.RICHMOND, map.FRANKSTON.SOUTH_YARRA),
  southYarraToCaulfield: MapSegment.full(map.FRANKSTON.SOUTH_YARRA, map.FRANKSTON.CAULFIELD),
  caulfieldToFrankston: MapSegment.full(map.FRANKSTON.CAULFIELD, map.FRANKSTON.FRANKSTON),
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
  new LineShapeEdge(station.SOUTH_YARRA, station.HAWKSBURN, [
    routeGraph.southYarraToHawksburn,
  ], [
    mapSegment.southYarraToCaulfield.part(1, 5),
  ]),
  new LineShapeEdge(station.HAWKSBURN, station.TOORAK, [
    routeGraph.hawksburnToToorak,
  ], [
    mapSegment.southYarraToCaulfield.part(2, 5),
  ]),
  new LineShapeEdge(station.TOORAK, station.ARMADALE, [
    routeGraph.toorakToArmadale,
  ], [
    mapSegment.southYarraToCaulfield.part(3, 5),
  ]),
  new LineShapeEdge(station.ARMADALE, station.MALVERN, [
    routeGraph.armadaleToMalvern,
  ], [
    mapSegment.southYarraToCaulfield.part(4, 5),
  ]),
  new LineShapeEdge(station.MALVERN, station.CAULFIELD, [
    routeGraph.malvernToCaulfield,
  ], [
    mapSegment.southYarraToCaulfield.part(5, 5),
  ]),
  new LineShapeEdge(station.CAULFIELD, station.GLEN_HUNTLY, [
    routeGraph.caulfieldToGlenHuntly,
  ], [
    mapSegment.caulfieldToFrankston.part(1, 20),
  ]),
  new LineShapeEdge(station.GLEN_HUNTLY, station.ORMOND, [
    routeGraph.glenHuntlyToOrmond,
  ], [
    mapSegment.caulfieldToFrankston.part(2, 20),
  ]),
  new LineShapeEdge(station.ORMOND, station.MCKINNON, [
    routeGraph.ormondToMcKinnon,
  ], [
    mapSegment.caulfieldToFrankston.part(3, 20),
  ]),
  new LineShapeEdge(station.MCKINNON, station.BENTLEIGH, [
    routeGraph.mcKinnonToBentleigh,
  ], [
    mapSegment.caulfieldToFrankston.part(4, 20),
  ]),
  new LineShapeEdge(station.BENTLEIGH, station.PATTERSON, [
    routeGraph.bentleighToPatterson,
  ], [
    mapSegment.caulfieldToFrankston.part(5, 20),
  ]),
  new LineShapeEdge(station.PATTERSON, station.MOORABBIN, [
    routeGraph.pattersonToMoorabbin,
  ], [
    mapSegment.caulfieldToFrankston.part(6, 20),
  ]),
  new LineShapeEdge(station.MOORABBIN, station.HIGHETT, [
    routeGraph.moorabbinToHighett,
  ], [
    mapSegment.caulfieldToFrankston.part(7, 20),
  ]),
  new LineShapeEdge(station.HIGHETT, station.SOUTHLAND, [
    routeGraph.highettToSouthland,
  ], [
    mapSegment.caulfieldToFrankston.part(8, 20),
  ]),
  new LineShapeEdge(station.SOUTHLAND, station.CHELTENHAM, [
    routeGraph.southlandToCheltenham,
  ], [
    mapSegment.caulfieldToFrankston.part(9, 20),
  ]),
  new LineShapeEdge(station.CHELTENHAM, station.MENTONE, [
    routeGraph.cheltenhamToMentone,
  ], [
    mapSegment.caulfieldToFrankston.part(10, 20),
  ]),
  new LineShapeEdge(station.MENTONE, station.PARKDALE, [
    routeGraph.mentoneToParkdale,
  ], [
    mapSegment.caulfieldToFrankston.part(11, 20),
  ]),
  new LineShapeEdge(station.PARKDALE, station.MORDIALLOC, [
    routeGraph.parkdaleToMordialloc,
  ], [
    mapSegment.caulfieldToFrankston.part(12, 20),
  ]),
  new LineShapeEdge(station.MORDIALLOC, station.ASPENDALE, [
    routeGraph.mordiallocToAspendale,
  ], [
    mapSegment.caulfieldToFrankston.part(13, 20),
  ]),
  new LineShapeEdge(station.ASPENDALE, station.EDITHVALE, [
    routeGraph.aspendaleToEdithvale,
  ], [
    mapSegment.caulfieldToFrankston.part(14, 20),
  ]),
  new LineShapeEdge(station.EDITHVALE, station.CHELSEA, [
    routeGraph.edithvaleToChelsea,
  ], [
    mapSegment.caulfieldToFrankston.part(15, 20),
  ]),
  new LineShapeEdge(station.CHELSEA, station.BONBEACH, [
    routeGraph.chelseaToBonbeach,
  ], [
    mapSegment.caulfieldToFrankston.part(16, 20),
  ]),
  new LineShapeEdge(station.BONBEACH, station.CARRUM, [
    routeGraph.bonbeachToCarrum,
  ], [
    mapSegment.caulfieldToFrankston.part(17, 20),
  ]),
  new LineShapeEdge(station.CARRUM, station.SEAFORD, [
    routeGraph.carrumToSeaford,
  ], [
    mapSegment.caulfieldToFrankston.part(18, 20),
  ]),
  new LineShapeEdge(station.SEAFORD, station.KANANOOK, [
    routeGraph.seafordToKananook,
  ], [
    mapSegment.caulfieldToFrankston.part(19, 20),
  ]),
  new LineShapeEdge(station.KANANOOK, station.FRANKSTON, [
    routeGraph.kananookToFrankston,
  ], [
    mapSegment.caulfieldToFrankston.part(20, 20),
  ]),
];

const routeGraphPairs = Object.values(routeGraph);
const lineShape = new LineShape(station.FLINDERS_STREET, lineShapeEdges);
const route = new LineRoute(routeGraphPairs, lineShape);

export const line = new Line({
  id: id.FRANKSTON,
  name: "Frankston",
  ptvIds: [6],
  route,
  lineType: "suburban",
  group: group.FRANKSTON,
});
