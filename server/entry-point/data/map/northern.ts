import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.NORTHERN)
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
  .add(station.NORTH_MELBOURNE, station.UPFIELD, [
    map.NORTHERN.NORTH_MELBOURNE,
    map.NORTHERN.UPFIELD,
  ])
  .add(station.NORTH_MELBOURNE, station.BROADMEADOWS, [
    map.NORTHERN.NORTH_MELBOURNE,
    map.NORTHERN.BROADMEADOWS,
  ])
  .add(station.BROADMEADOWS, station.CRAIGIEBURN, [
    map.NORTHERN.BROADMEADOWS,
    map.NORTHERN.CRAIGIEBURN,
  ])
  .add(station.NORTH_MELBOURNE, station.FOOTSCRAY, [
    map.NORTHERN.NORTH_MELBOURNE,
    map.NORTHERN.FOOTSCRAY,
  ])
  .add(station.FOOTSCRAY, station.SUNSHINE, [
    // TODO: [DS] This won't work. Will require manual intervention. Probably
    // need a method so we can pass [MapSegment.part(x, y)] for Tottenham
    // manually.
    map.NORTHERN.FOOTSCRAY,
    map.NORTHERN.SUNSHINE_JUNCTION,
    map.NORTHERN.SUNSHINE,
  ])
  .add(station.SUNSHINE, station.WATERGARDENS, [
    map.NORTHERN.SUNSHINE,
    map.NORTHERN.WATERGARDENS,
  ])
  .add(station.WATERGARDENS, station.SUNBURY, [
    map.NORTHERN.WATERGARDENS,
    map.NORTHERN.SUNBURY,
  ])
  .build();
