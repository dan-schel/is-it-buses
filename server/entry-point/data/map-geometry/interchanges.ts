import { InterchangeBlueprint } from "@/server/services/map-geometry/interchange-blueprint";
import * as station from "@/shared/station-ids";
import * as node from "@/shared/map-node-ids";

export const flindersStreet = InterchangeBlueprint.simple(
  station.FLINDERS_STREET,
  [
    node.NORTHERN.FLINDERS_STREET_DIRECT,
    node.NORTHERN.FLINDERS_STREET_LOOP,
    node.CLIFTON_HILL.FLINDERS_STREET_DIRECT,
    node.CLIFTON_HILL.FLINDERS_STREET_LOOP,
    node.BURNLEY.FLINDERS_STREET_DIRECT,
    node.BURNLEY.FLINDERS_STREET_LOOP,
    node.DANDENONG.FLINDERS_STREET_DIRECT,
    node.DANDENONG.FLINDERS_STREET_LOOP,
    node.GIPPSLAND.FLINDERS_STREET,
    node.FRANKSTON.FLINDERS_STREET,
    node.NEWPORT.FLINDERS_STREET,
    node.SANDRINGHAM.FLINDERS_STREET,
  ],
  node.NORTHERN.FLINDERS_STREET_DIRECT,
  "right-edge",
  node.SANDRINGHAM.FLINDERS_STREET,
  "right-edge",
);

export const southernCross = new InterchangeBlueprint(
  station.SOUTHERN_CROSS,
  [
    node.NORTHERN.SOUTHERN_CROSS,
    node.CLIFTON_HILL.SOUTHERN_CROSS,
    node.BURNLEY.SOUTHERN_CROSS,
    node.DANDENONG.SOUTHERN_CROSS,
    node.GIPPSLAND.SOUTHERN_CROSS,
    node.REGIONAL_WESTERN.SOUTHERN_CROSS,
    node.NEWPORT.SOUTHERN_CROSS,
  ],
  [
    [
      { nodeId: node.NEWPORT.SOUTHERN_CROSS, position: "left-edge" },
      { nodeId: node.NEWPORT.SOUTHERN_CROSS, position: "right-inner" },
    ],
    [
      { nodeId: node.DANDENONG.SOUTHERN_CROSS, position: "left-inner" },
      { nodeId: node.NORTHERN.SOUTHERN_CROSS, position: "right-edge" },
    ],
  ],
  [
    { nodeId: node.NEWPORT.SOUTHERN_CROSS, position: "left-edge" },
    { nodeId: node.NORTHERN.SOUTHERN_CROSS, position: "right-edge" },
  ],
);

export const flagstaff = InterchangeBlueprint.simple(
  station.FLAGSTAFF,
  [
    node.NORTHERN.FLAGSTAFF,
    node.CLIFTON_HILL.FLAGSTAFF,
    node.BURNLEY.FLAGSTAFF,
    node.DANDENONG.FLAGSTAFF,
  ],
  node.DANDENONG.FLAGSTAFF,
  "left-edge",
  node.NORTHERN.FLAGSTAFF,
  "right-edge",
);

export const melbourneCentral = InterchangeBlueprint.simple(
  station.MELBOURNE_CENTRAL,
  [
    node.NORTHERN.MELBOURNE_CENTRAL,
    node.CLIFTON_HILL.MELBOURNE_CENTRAL,
    node.BURNLEY.MELBOURNE_CENTRAL,
    node.DANDENONG.MELBOURNE_CENTRAL,
  ],
  node.DANDENONG.MELBOURNE_CENTRAL,
  "left-edge",
  node.NORTHERN.MELBOURNE_CENTRAL,
  "right-edge",
);

export const parliament = InterchangeBlueprint.simple(
  station.PARLIAMENT,
  [
    node.NORTHERN.PARLIAMENT,
    node.CLIFTON_HILL.PARLIAMENT,
    node.BURNLEY.PARLIAMENT,
    node.DANDENONG.PARLIAMENT,
  ],
  node.DANDENONG.PARLIAMENT,
  "left-edge",
  node.NORTHERN.PARLIAMENT,
  "right-edge",
);

export const richmond = InterchangeBlueprint.simple(
  station.RICHMOND,
  [
    node.SANDRINGHAM.RICHMOND,
    node.FRANKSTON.RICHMOND,
    node.GIPPSLAND.RICHMOND,
    node.DANDENONG.RICHMOND,
    node.BURNLEY.RICHMOND,
  ],
  node.BURNLEY.RICHMOND,
  "left-edge",
  node.SANDRINGHAM.RICHMOND,
  "right-edge",
);

export const northMelbourne = new InterchangeBlueprint(
  station.NORTH_MELBOURNE,
  [
    node.NEWPORT.NORTH_MELBOURNE,
    node.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL,
    node.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR,
    node.NORTHERN.NORTH_MELBOURNE,
  ],
  [
    [
      { nodeId: node.NEWPORT.NORTH_MELBOURNE, position: "left-edge" },
      { nodeId: node.NEWPORT.NORTH_MELBOURNE, position: "right-inner" },
    ],
    [
      {
        nodeId: node.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR,
        position: "left-inner",
      },
      { nodeId: node.NORTHERN.NORTH_MELBOURNE, position: "right-edge" },
    ],
  ],
  [
    { nodeId: node.NEWPORT.NORTH_MELBOURNE, position: "left-edge" },
    { nodeId: node.NORTHERN.NORTH_MELBOURNE, position: "right-edge" },
  ],
);

export const cliftonHill = InterchangeBlueprint.single(
  station.CLIFTON_HILL,
  node.CLIFTON_HILL.CLIFTON_HILL,
);

export const burnley = InterchangeBlueprint.single(
  station.BURNLEY,
  node.BURNLEY.BURNLEY,
);

export const camberwell = InterchangeBlueprint.single(
  station.CAMBERWELL,
  node.BURNLEY.CAMBERWELL,
);

export const ringwood = InterchangeBlueprint.single(
  station.RINGWOOD,
  node.BURNLEY.RINGWOOD,
);

export const southYarra = new InterchangeBlueprint(
  station.SOUTH_YARRA,
  [
    node.SANDRINGHAM.SOUTH_YARRA,
    node.FRANKSTON.SOUTH_YARRA,
    node.GIPPSLAND.SOUTH_YARRA,
    node.DANDENONG.SOUTH_YARRA,
  ],
  [
    [
      { nodeId: node.DANDENONG.SOUTH_YARRA, position: "left-edge" },
      { nodeId: node.DANDENONG.SOUTH_YARRA, position: "right-inner" },
    ],
    [
      { nodeId: node.FRANKSTON.SOUTH_YARRA, position: "left-inner" },
      { nodeId: node.SANDRINGHAM.SOUTH_YARRA, position: "right-edge" },
    ],
  ],
  [
    { nodeId: node.DANDENONG.SOUTH_YARRA, position: "left-edge" },
    { nodeId: node.SANDRINGHAM.SOUTH_YARRA, position: "right-edge" },
  ],
);

export const caulfield = InterchangeBlueprint.simple(
  station.CAULFIELD,
  [
    node.FRANKSTON.CAULFIELD,
    node.GIPPSLAND.CAULFIELD,
    node.DANDENONG.CAULFIELD,
  ],
  node.DANDENONG.CAULFIELD,
  "left-edge",
  node.FRANKSTON.CAULFIELD,
  "right-edge",
);

export const clayton = InterchangeBlueprint.simple(
  station.CLAYTON,
  [node.GIPPSLAND.CLAYTON, node.DANDENONG.CLAYTON],
  node.DANDENONG.CLAYTON,
  "left-edge",
  node.GIPPSLAND.CLAYTON,
  "right-edge",
);

export const dandenong = InterchangeBlueprint.simple(
  station.DANDENONG,
  [node.GIPPSLAND.DANDENONG, node.DANDENONG.DANDENONG],
  node.DANDENONG.DANDENONG,
  "left-edge",
  node.GIPPSLAND.DANDENONG,
  "right-edge",
);

export const pakenham = InterchangeBlueprint.simple(
  station.PAKENHAM,
  [node.GIPPSLAND.PAKENHAM, node.DANDENONG.PAKENHAM],
  node.DANDENONG.PAKENHAM,
  "left-edge",
  node.GIPPSLAND.PAKENHAM,
  "right-edge",
);

export const footscray = InterchangeBlueprint.simple(
  station.FOOTSCRAY,
  [
    node.NEWPORT.FOOTSCRAY,
    node.REGIONAL_WESTERN.FOOTSCRAY,
    node.NORTHERN.FOOTSCRAY,
  ],
  node.NEWPORT.FOOTSCRAY,
  "left-edge",
  node.NORTHERN.FOOTSCRAY,
  "right-edge",
);

export const frankston = InterchangeBlueprint.simple(
  station.FRANKSTON,
  [node.FRANKSTON.FRANKSTON, node.STONY_POINT.FRANKSTON],
  node.FRANKSTON.FRANKSTON,
  "left-edge",
  node.STONY_POINT.FRANKSTON,
  "right-edge",
);

export const broadmeadows = InterchangeBlueprint.simple(
  station.BROADMEADOWS,
  [node.NORTHERN.BROADMEADOWS, node.REGIONAL_WESTERN.BROADMEADOWS],
  node.REGIONAL_WESTERN.BROADMEADOWS,
  "left-edge",
  node.NORTHERN.BROADMEADOWS,
  "right-edge",
);

export const craigieburn = InterchangeBlueprint.simple(
  station.CRAIGIEBURN,
  [node.NORTHERN.CRAIGIEBURN, node.REGIONAL_WESTERN.CRAIGIEBURN],
  node.REGIONAL_WESTERN.CRAIGIEBURN,
  "left-edge",
  node.NORTHERN.CRAIGIEBURN,
  "right-edge",
);

export const seymour = InterchangeBlueprint.single(
  station.SEYMOUR,
  node.REGIONAL_WESTERN.SEYMOUR,
);

export const newport = InterchangeBlueprint.single(
  station.NEWPORT,
  node.NEWPORT.NEWPORT,
);

export const laverton = InterchangeBlueprint.single(
  station.LAVERTON,
  node.NEWPORT.LAVERTON_EXPRESS,
);

export const sunshine = new InterchangeBlueprint(
  station.SUNSHINE,
  [
    node.NORTHERN.SUNSHINE,
    node.REGIONAL_WESTERN.SUNSHINE_BENDIGO,
    node.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
  ],
  [
    [
      {
        nodeId: node.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
        position: "left-edge",
      },
      {
        nodeId: node.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
        position: "right-edge",
      },
    ],
    [
      { nodeId: node.NORTHERN.SUNSHINE, position: "left-inner" },
      { nodeId: node.NORTHERN.SUNSHINE, position: "right-edge" },
    ],
  ],
  [
    { nodeId: node.REGIONAL_WESTERN.SUNSHINE_DEER_PARK, position: "left-edge" },
    {
      nodeId: node.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
      position: "right-edge",
    },
    { nodeId: node.NORTHERN.SUNSHINE, position: "right-edge" },
  ],
);

export const watergardens = InterchangeBlueprint.simple(
  station.WATERGARDENS,
  [node.NORTHERN.WATERGARDENS, node.REGIONAL_WESTERN.WATERGARDENS],
  node.REGIONAL_WESTERN.WATERGARDENS,
  "left-edge",
  node.NORTHERN.WATERGARDENS,
  "right-edge",
);

export const sunbury = InterchangeBlueprint.simple(
  station.SUNBURY,
  [node.NORTHERN.SUNBURY, node.REGIONAL_WESTERN.SUNBURY],
  node.REGIONAL_WESTERN.SUNBURY,
  "left-edge",
  node.NORTHERN.SUNBURY,
  "right-edge",
);

export const bendigo = InterchangeBlueprint.single(
  station.BENDIGO,
  node.REGIONAL_WESTERN.BENDIGO,
);

export const ballarat = InterchangeBlueprint.single(
  station.BALLARAT,
  node.REGIONAL_WESTERN.BALLARAT,
);

export const deerPark = InterchangeBlueprint.single(
  station.DEER_PARK,
  node.REGIONAL_WESTERN.DEER_PARK,
);
