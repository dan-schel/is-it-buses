import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.BENDIGO)
  .add(station.SOUTHERN_CROSS, station.FOOTSCRAY, [
    map.REGIONAL_WESTERN.SOUTHERN_CROSS,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL,
    map.REGIONAL_WESTERN.FOOTSCRAY,
  ])
  .add(station.FOOTSCRAY, station.WATERGARDENS, [
    map.REGIONAL_WESTERN.FOOTSCRAY,
    map.REGIONAL_WESTERN.SUNSHINE_JUNCTION,
    map.REGIONAL_WESTERN.SUNSHINE_BENDIGO,
    map.REGIONAL_WESTERN.WATERGARDENS,
  ])
  .add(station.WATERGARDENS, station.SUNBURY, [
    map.REGIONAL_WESTERN.WATERGARDENS,
    map.REGIONAL_WESTERN.SUNBURY,
  ])
  .add(station.SUNBURY, station.BENDIGO, [
    map.REGIONAL_WESTERN.SUNBURY,
    map.REGIONAL_WESTERN.BENDIGO,
  ])
  .add(station.BENDIGO, station.ECHUCA, [
    map.REGIONAL_WESTERN.BENDIGO,
    map.REGIONAL_WESTERN.ECHUCA,
  ])
  .add(station.BENDIGO, station.SWAN_HILL, [
    map.REGIONAL_WESTERN.BENDIGO,
    map.REGIONAL_WESTERN.SWAN_HILL,
  ])
  .build();
