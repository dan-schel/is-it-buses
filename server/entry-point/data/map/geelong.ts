import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { MapSegment } from "@/server/data/map/map-segment";

export const mappingData = new MappingDataBuilder(
  group.GEELONG,
  station,
  map.REGIONAL_WESTERN,
)
  .chain(station.SOUTHERN_CROSS, station.FOOTSCRAY, [
    map.REGIONAL_WESTERN.SOUTHERN_CROSS,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL,
    map.REGIONAL_WESTERN.FOOTSCRAY,
  ])
  .chain(station.FOOTSCRAY, station.SUNSHINE, [
    map.REGIONAL_WESTERN.FOOTSCRAY,
    map.REGIONAL_WESTERN.SUNSHINE_JUNCTION,
    map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
  ])
  .manual(
    station.SUNSHINE,
    station.DEER_PARK,
    MapSegment.full(
      map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
      map.REGIONAL_WESTERN.DEER_PARK,
    ),
  )
  .auto("DEER_PARK", "WARRNAMBOOL")
  .build();
