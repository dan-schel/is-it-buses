import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.DANDENONG)
  .add("the-city", station.RICHMOND, [
    map.DANDENONG.FLINDERS_STREET_LOOP,
    map.DANDENONG.SOUTHERN_CROSS,
    map.DANDENONG.FLAGSTAFF,
    map.DANDENONG.MELBOURNE_CENTRAL,
    map.DANDENONG.PARLIAMENT,
    map.DANDENONG.RICHMOND,
  ])
  .add("the-city", station.RICHMOND, [
    map.DANDENONG.FLINDERS_STREET_DIRECT,
    map.DANDENONG.RICHMOND,
  ])
  .add(station.RICHMOND, station.SOUTH_YARRA, [
    map.DANDENONG.RICHMOND,
    map.DANDENONG.SOUTH_YARRA,
  ])
  .add(station.SOUTH_YARRA, station.CAULFIELD, [
    map.DANDENONG.SOUTH_YARRA,
    map.DANDENONG.CAULFIELD,
  ])
  .add(station.CAULFIELD, station.CLAYTON, [
    map.DANDENONG.CAULFIELD,
    map.DANDENONG.CLAYTON,
  ])
  .add(station.CLAYTON, station.DANDENONG, [
    map.DANDENONG.CLAYTON,
    map.DANDENONG.DANDENONG,
  ])
  .add(station.DANDENONG, station.CRANBOURNE, [
    map.DANDENONG.DANDENONG,
    map.DANDENONG.CRANBOURNE,
  ])
  .add(station.DANDENONG, station.PAKENHAM, [
    map.DANDENONG.DANDENONG,
    map.DANDENONG.PAKENHAM,
  ])
  .add(station.PAKENHAM, station.EAST_PAKENHAM, [
    map.DANDENONG.PAKENHAM,
    map.DANDENONG.EAST_PAKENHAM,
  ])
  .build();
