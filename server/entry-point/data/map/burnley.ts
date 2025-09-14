import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.BURNLEY)
  .add("the-city", station.RICHMOND, [
    map.BURNLEY.FLINDERS_STREET_LOOP,
    map.BURNLEY.SOUTHERN_CROSS,
    map.BURNLEY.FLAGSTAFF,
    map.BURNLEY.MELBOURNE_CENTRAL,
    map.BURNLEY.PARLIAMENT,
    map.BURNLEY.RICHMOND,
  ])
  .add("the-city", station.RICHMOND, [
    map.BURNLEY.FLINDERS_STREET_DIRECT,
    map.BURNLEY.RICHMOND,
  ])
  .add(station.RICHMOND, station.BURNLEY, [
    map.BURNLEY.RICHMOND,
    map.BURNLEY.BURNLEY,
  ])
  .add(station.BURNLEY, station.GLEN_WAVERLEY, [
    map.BURNLEY.BURNLEY,
    map.BURNLEY.GLEN_WAVERLEY,
  ])
  .add(station.BURNLEY, station.CAMBERWELL, [
    map.BURNLEY.BURNLEY,
    map.BURNLEY.CAMBERWELL,
  ])
  .add(station.CAMBERWELL, station.ALAMEIN, [
    map.BURNLEY.CAMBERWELL,
    map.BURNLEY.ALAMEIN,
  ])
  .add(station.CAMBERWELL, station.RINGWOOD, [
    map.BURNLEY.CAMBERWELL,
    map.BURNLEY.RINGWOOD,
  ])
  .add(station.RINGWOOD, station.LILYDALE, [
    map.BURNLEY.RINGWOOD,
    map.BURNLEY.LILYDALE,
  ])
  .add(station.RINGWOOD, station.BELGRAVE, [
    map.BURNLEY.RINGWOOD,
    map.BURNLEY.BELGRAVE,
  ])
  .build();
