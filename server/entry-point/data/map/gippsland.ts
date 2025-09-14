import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

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
  .add(station.PAKENHAM, station.BAIRNSDALE, [
    // TODO: [DS] This won't work. Will require manual intervention. Probably
    // need a method so we can pass [MapSegment.part(x, y)] for East Pakenham
    // manually.
    map.GIPPSLAND.PAKENHAM,
    map.GIPPSLAND.EAST_PAKENHAM,
    map.GIPPSLAND.BAIRNSDALE,
  ])
  .build();
