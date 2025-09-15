import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(
  group.BENDIGO,
  station,
  map.REGIONAL_WESTERN,
)
  .chain(station.SOUTHERN_CROSS, station.FOOTSCRAY, [
    map.REGIONAL_WESTERN.SOUTHERN_CROSS,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL,
    map.REGIONAL_WESTERN.FOOTSCRAY,
  ])
  .chain(station.FOOTSCRAY, station.WATERGARDENS, [
    map.REGIONAL_WESTERN.FOOTSCRAY,
    map.REGIONAL_WESTERN.SUNSHINE_JUNCTION,
    map.REGIONAL_WESTERN.SUNSHINE_BENDIGO,
    map.REGIONAL_WESTERN.WATERGARDENS,
  ])
  .auto("WATERGARDENS", "SUNBURY")
  .auto("SUNBURY", "BENDIGO")
  .auto("BENDIGO", "ECHUCA")
  .auto("BENDIGO", "SWAN_HILL")
  .build();
