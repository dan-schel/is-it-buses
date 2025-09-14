import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { MapSegment } from "@/server/data/map-segment";
import { Range } from "@/server/data/utils/range";

const PAKENHAM_TO_EAST_PAKENHAM = new MapSegment(
  map.GIPPSLAND.PAKENHAM,
  map.GIPPSLAND.EAST_PAKENHAM,
  Range.full,
);

const [EAST_PAKENHAM_TO_NAR_NAR_GOON, NAR_NAR_NAR_TO_BAIRNSDALE] =
  new MapSegment(
    map.GIPPSLAND.EAST_PAKENHAM,
    map.GIPPSLAND.BAIRNSDALE,
    Range.full,
  ).split(1 / 16);

export const mappingData = new MappingDataBuilder(
  group.GIPPSLAND,
  station,
  map.GIPPSLAND,
)
  .auto("SOUTHERN_CROSS", "FLINDERS_STREET")
  .auto("FLINDERS_STREET", "RICHMOND")
  .add(station.RICHMOND, station.CAULFIELD, [
    map.GIPPSLAND.RICHMOND,
    map.GIPPSLAND.SOUTH_YARRA,
    map.GIPPSLAND.CAULFIELD,
  ])
  .auto("CAULFIELD", "CLAYTON")
  .auto("CLAYTON", "DANDENONG")
  .auto("DANDENONG", "PAKENHAM")
  .manual(station.PAKENHAM, station.NAR_NAR_GOON, [
    PAKENHAM_TO_EAST_PAKENHAM,
    EAST_PAKENHAM_TO_NAR_NAR_GOON,
  ])
  .spread(station.NAR_NAR_GOON, station.BAIRNSDALE, NAR_NAR_NAR_TO_BAIRNSDALE)
  .build();
