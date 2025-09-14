import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(
  group.NORTHERN,
  station,
  map.NORTHERN,
)
  .add("the-city", station.NORTH_MELBOURNE, [
    map.NORTHERN.FLINDERS_STREET_DIRECT,
    map.NORTHERN.SOUTHERN_CROSS,
    map.NORTHERN.NORTH_MELBOURNE,
  ])
  .add("the-city", station.NORTH_MELBOURNE, [
    map.NORTHERN.FLINDERS_STREET_LOOP,
    map.NORTHERN.PARLIAMENT,
    map.NORTHERN.MELBOURNE_CENTRAL,
    map.NORTHERN.FLAGSTAFF,
    map.NORTHERN.NORTH_MELBOURNE,
  ])
  .auto("NORTH_MELBOURNE", "UPFIELD")
  .auto("NORTH_MELBOURNE", "BROADMEADOWS")
  .auto("BROADMEADOWS", "CRAIGIEBURN")
  .auto("NORTH_MELBOURNE", "FOOTSCRAY")
  .add(station.FOOTSCRAY, station.SUNSHINE, [
    // TODO: [DS] This won't work. Will require manual intervention. Probably
    // need a method so we can pass [MapSegment.part(x, y)] for Tottenham
    // manually.
    map.NORTHERN.FOOTSCRAY,
    map.NORTHERN.SUNSHINE_JUNCTION,
    map.NORTHERN.SUNSHINE,
  ])
  .auto("SUNSHINE", "WATERGARDENS")
  .auto("WATERGARDENS", "SUNBURY")
  .build();
