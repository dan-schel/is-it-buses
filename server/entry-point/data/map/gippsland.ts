import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.GIPPSLAND)
  .add(station.SOUTHERN_CROSS, station.FLINDERS_STREET, [
    map.GIPPSLAND.SOUTHERN_CROSS,
    map.GIPPSLAND.FLINDERS_STREET,
  ])
  .add(station.FLINDERS_STREET, station.RICHMOND, [
    map.GIPPSLAND.FLINDERS_STREET,
    map.GIPPSLAND.RICHMOND,
  ])
  .add(station.RICHMOND, station.CAULFIELD, [
    map.GIPPSLAND.RICHMOND,
    map.GIPPSLAND.SOUTH_YARRA,
    map.GIPPSLAND.CAULFIELD,
  ])
  .add(station.CAULFIELD, station.CLAYTON, [
    map.GIPPSLAND.CAULFIELD,
    map.GIPPSLAND.CLAYTON,
  ])
  .add(station.CLAYTON, station.DANDENONG, [
    map.GIPPSLAND.CLAYTON,
    map.GIPPSLAND.DANDENONG,
  ])
  .add(station.DANDENONG, station.PAKENHAM, [
    map.GIPPSLAND.DANDENONG,
    map.GIPPSLAND.PAKENHAM,
  ])
  .add(station.PAKENHAM, station.BAIRNSDALE, [
    // TODO: [DS] This won't work. Will require manual intervention. Probably
    // need a method so we can pass [MapSegment.part(x, y)] for East Pakenham
    // manually.
    map.GIPPSLAND.PAKENHAM,
    map.GIPPSLAND.EAST_PAKENHAM,
    map.GIPPSLAND.BAIRNSDALE,
  ])
  .build();
