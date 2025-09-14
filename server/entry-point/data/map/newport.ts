import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(
  group.NEWPORT,
  station,
  map.NEWPORT,
)
  .auto("FLINDERS_STREET", "SOUTHERN_CROSS")
  .auto("SOUTHERN_CROSS", "NORTH_MELBOURNE")
  .auto("NORTH_MELBOURNE", "FOOTSCRAY")
  .auto("FOOTSCRAY", "NEWPORT")
  .auto("NEWPORT", "WILLIAMSTOWN")
  .add(station.NEWPORT, station.LAVERTON, [
    map.NEWPORT.NEWPORT,
    map.NEWPORT.LAVERTON_EXPRESS,
  ])
  .add(station.NEWPORT, station.LAVERTON, [
    map.NEWPORT.NEWPORT,
    map.NEWPORT.LAVERTON_LOOP,
  ])
  .add(station.LAVERTON, station.WERRIBEE, [
    map.NEWPORT.LAVERTON_LOOP,
    map.NEWPORT.WERRIBEE,
  ])
  .build();
