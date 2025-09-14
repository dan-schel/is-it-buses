import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { MapSegment } from "@/server/data/map-segment";

export const mappingData = new MappingDataBuilder(
  group.SEYMOUR,
  station,
  map.REGIONAL_WESTERN,
)
  .chain(station.SOUTHERN_CROSS, station.NORTH_MELBOURNE, [
    map.REGIONAL_WESTERN.SOUTHERN_CROSS,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR,
  ])
  .manual(
    station.NORTH_MELBOURNE,
    station.BROADMEADOWS,
    MapSegment.full(
      map.REGIONAL_WESTERN.NORTH_MELBOURNE_SEYMOUR,
      map.REGIONAL_WESTERN.BROADMEADOWS,
    ),
  )
  .auto("BROADMEADOWS", "CRAIGIEBURN")
  .auto("CRAIGIEBURN", "SEYMOUR")
  .auto("SEYMOUR", "ALBURY")
  .auto("SEYMOUR", "SHEPPARTON")
  .build();
