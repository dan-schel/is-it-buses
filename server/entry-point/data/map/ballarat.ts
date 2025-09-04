import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

const mappingData = new MappingDataBuilder(group.BALLARAT)
  // In this case, Southern Cross and Footscray are adjacent nodes, but the have
  // multiple map segments between them.
  .add(station.SOUTHERN_CROSS, station.FOOTSCRAY, [
    map.REGIONAL_WESTERN.SOUTHERN_CROSS,

    // The map data is a tree too, so theoretically we could drop these two
    // inner nodes and force the builder to work it out, although currently the
    // server doesn't have the map data. It's in that .json file we generate for
    // the frontend (that I want the server to own eventually, but that
    // migration should probably wait for later).
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_JUNCTION,
    map.REGIONAL_WESTERN.NORTH_MELBOURNE_RRL,

    map.REGIONAL_WESTERN.FOOTSCRAY,
  ])
  .add(station.FOOTSCRAY, station.SUNSHINE, [
    map.REGIONAL_WESTERN.FOOTSCRAY,
    map.REGIONAL_WESTERN.SUNSHINE_JUNCTION,
    map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
  ])

  // These cases are different though, now we have a single map segment in each
  // case, but multiple nodes. The builder should be smart enough to evenly
  // distribute the corridor between the stations.
  .add(station.SUNSHINE, station.DEER_PARK, [
    map.REGIONAL_WESTERN.SUNSHINE_DEER_PARK,
    map.REGIONAL_WESTERN.DEER_PARK,
  ])
  .add(station.DEER_PARK, station.BALLARAT, [
    map.REGIONAL_WESTERN.DEER_PARK,
    map.REGIONAL_WESTERN.BALLARAT,
  ])
  .add(station.BALLARAT, station.MARYBOROUGH, [
    map.REGIONAL_WESTERN.BALLARAT,
    map.REGIONAL_WESTERN.MARYBOROUGH,
  ])
  .add(station.BALLARAT, station.ARARAT, [
    map.REGIONAL_WESTERN.BALLARAT,
    map.REGIONAL_WESTERN.ARARAT,
  ])
  .build();

// There cannot be a situation where we give one map node ID.
// There also cannot be a situation where we give more than 2 map node IDs and
// the nodes AREN'T adjacent. In that case we wouldn't know where to place any
// intermediate nodes. (You'd think we could try to evenly distribute amongst
// the multiple segments, but we don't know their lengths because they're
// variable!)
