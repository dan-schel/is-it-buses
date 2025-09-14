import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.SANDRINGHAM)
  .add(station.FLINDERS_STREET, station.RICHMOND, [
    map.SANDRINGHAM.FLINDERS_STREET,
    map.SANDRINGHAM.RICHMOND,
  ])
  .add(station.RICHMOND, station.SOUTH_YARRA, [
    map.SANDRINGHAM.RICHMOND,
    map.SANDRINGHAM.SOUTH_YARRA,
  ])
  .add(station.SOUTH_YARRA, station.SANDRINGHAM, [
    map.SANDRINGHAM.SOUTH_YARRA,
    map.SANDRINGHAM.SANDRINGHAM,
  ])
  .build();
