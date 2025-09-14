import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { Range } from "@/server/data/utils/range";
import { MapSegment } from "@/server/data/map-segment";

const [FOOTSCRAY_TO_TOTTENHAM, TOTTENHAM_TO_SUNSHINE_JUNCTION] = new MapSegment(
  map.NORTHERN.FOOTSCRAY,
  map.NORTHERN.SUNSHINE_JUNCTION,
  Range.full,
).split(3 / 4);

const SUNSHINE_JUNCTION_TO_SUNSHINE = new MapSegment(
  map.NORTHERN.SUNSHINE_JUNCTION,
  map.NORTHERN.SUNSHINE,
  Range.full,
);

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
  .spread(station.FOOTSCRAY, station.TOTTENHAM, FOOTSCRAY_TO_TOTTENHAM)
  .manual(station.TOTTENHAM, station.SUNSHINE, [
    TOTTENHAM_TO_SUNSHINE_JUNCTION,
    SUNSHINE_JUNCTION_TO_SUNSHINE,
  ])
  .auto("SUNSHINE", "WATERGARDENS")
  .auto("WATERGARDENS", "SUNBURY")
  .build();
