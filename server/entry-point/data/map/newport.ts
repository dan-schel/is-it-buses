import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.NEWPORT)
  .add(station.FLINDERS_STREET, station.SOUTHERN_CROSS, [
    map.NEWPORT.FLINDERS_STREET,
    map.NEWPORT.SOUTHERN_CROSS,
  ])
  .add(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE, [
    map.NEWPORT.SOUTHERN_CROSS,
    map.NEWPORT.NORTH_MELBOURNE,
  ])
  .add(station.NORTH_MELBOURNE, station.FOOTSCRAY, [
    map.NEWPORT.NORTH_MELBOURNE,
    map.NEWPORT.FOOTSCRAY,
  ])
  .add(station.FOOTSCRAY, station.NEWPORT, [
    map.NEWPORT.FOOTSCRAY,
    map.NEWPORT.NEWPORT,
  ])
  .add(station.NEWPORT, station.WILLIAMSTOWN, [
    map.NEWPORT.NEWPORT,
    map.NEWPORT.WILLIAMSTOWN,
  ])
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
