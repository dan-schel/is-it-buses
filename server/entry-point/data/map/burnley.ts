import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { MapSegment } from "@/server/data/map/map-segment";

export const mappingData = new MappingDataBuilder(
  group.BURNLEY,
  station,
  map.BURNLEY,
)
  .chain("the-city", station.RICHMOND, [
    map.BURNLEY.FLINDERS_STREET_LOOP,
    map.BURNLEY.SOUTHERN_CROSS,
    map.BURNLEY.FLAGSTAFF,
    map.BURNLEY.MELBOURNE_CENTRAL,
    map.BURNLEY.PARLIAMENT,
    map.BURNLEY.RICHMOND,
  ])
  .manual(
    "the-city",
    station.RICHMOND,
    MapSegment.full(map.BURNLEY.FLINDERS_STREET_DIRECT, map.BURNLEY.RICHMOND),
  )
  .auto("RICHMOND", "BURNLEY")
  .auto("BURNLEY", "GLEN_WAVERLEY")
  .auto("BURNLEY", "CAMBERWELL")
  .auto("CAMBERWELL", "ALAMEIN")
  .auto("CAMBERWELL", "RINGWOOD")
  .auto("RINGWOOD", "LILYDALE")
  .auto("RINGWOOD", "BELGRAVE")
  .build();
