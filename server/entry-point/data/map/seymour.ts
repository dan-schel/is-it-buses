import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.SEYMOUR)
  .add(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE, [
    map.REGIONAL_WESTERN.SOUTHERN_CROSS,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR,
  ])
  .add(station.NORTH_MELBOURNE, station.BROADMEADOWS, [
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR,
    map.REGIONAL_WESTERN.BROADMEADOWS,
  ])
  .add(station.BROADMEADOWS, station.CRAIGIEBURN, [
    map.REGIONAL_WESTERN.BROADMEADOWS,
    map.REGIONAL_WESTERN.CRAIGIEBURN,
  ])
  .add(station.CRAIGIEBURN, station.SEYMOUR, [
    map.REGIONAL_WESTERN.CRAIGIEBURN,
    map.REGIONAL_WESTERN.SEYMOUR,
  ])
  .add(station.SEYMOUR, station.ALBURY, [
    map.REGIONAL_WESTERN.SEYMOUR,
    map.REGIONAL_WESTERN.ALBURY,
  ])
  .add(station.SEYMOUR, station.SHEPPARTON, [
    map.REGIONAL_WESTERN.SEYMOUR,
    map.REGIONAL_WESTERN.SHEPPARTON,
  ])
  .build();
