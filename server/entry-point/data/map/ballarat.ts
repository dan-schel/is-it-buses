import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";

// string = there are a string of map points between two adjacent nodes
// spread = there are two map points between which sit multiple nodes, which should be evenly distributed

const mappingData = new MappingDataBuilder(group.BALLARAT)
  .string(station.SOUTHERN_CROSS, station.FOOTSCRAY, [
    map.REGIONAL_WESTERN.SOUTHERN_CROSS,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL,
    map.REGIONAL_WESTERN.FOOTSCRAY,
  ])
  .string(station.FOOTSCRAY, station.SUNSHINE, [
    map.REGIONAL_WESTERN.FOOTSCRAY,
    map.REGIONAL_WESTERN.SUNSHINE_JUNCTION,
    map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
  ])
  .spread(
    station.SUNSHINE,
    station.DEER_PARK,
    map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
    map.REGIONAL_WESTERN.DEER_PARK,
  )
  .spread(
    station.DEER_PARK,
    station.BALLARAT,
    map.REGIONAL_WESTERN.DEER_PARK,
    map.REGIONAL_WESTERN.BALLARAT,
  )
  .spread(
    station.BALLARAT,
    station.MARYBOROUGH,
    map.REGIONAL_WESTERN.BALLARAT,
    map.REGIONAL_WESTERN.MARYBOROUGH,
  )
  .spread(
    station.BALLARAT,
    station.ARARAT,
    map.REGIONAL_WESTERN.BALLARAT,
    map.REGIONAL_WESTERN.ARARAT,
  )
  .build();
