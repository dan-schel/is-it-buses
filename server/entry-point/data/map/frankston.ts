import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.FRANKSTON)
  .add(station.FLINDERS_STREET, station.RICHMOND, [
    map.FRANKSTON.FLINDERS_STREET,
    map.FRANKSTON.RICHMOND,
  ])
  .add(station.RICHMOND, station.SOUTH_YARRA, [
    map.FRANKSTON.RICHMOND,
    map.FRANKSTON.SOUTH_YARRA,
  ])
  .add(station.SOUTH_YARRA, station.CAULFIELD, [
    map.FRANKSTON.SOUTH_YARRA,
    map.FRANKSTON.CAULFIELD,
  ])
  .add(station.CAULFIELD, station.FRANKSTON, [
    map.FRANKSTON.CAULFIELD,
    map.FRANKSTON.FRANKSTON,
  ])
  .build();
