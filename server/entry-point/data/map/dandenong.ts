import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";
import { MapSegment } from "@/server/data/map/map-segment";

export const mappingData = new MappingDataBuilder(
  group.DANDENONG,
  station,
  map.DANDENONG,
)
  .chain("the-city", station.RICHMOND, [
    map.DANDENONG.FLINDERS_STREET_LOOP,
    map.DANDENONG.SOUTHERN_CROSS,
    map.DANDENONG.FLAGSTAFF,
    map.DANDENONG.MELBOURNE_CENTRAL,
    map.DANDENONG.PARLIAMENT,
    map.DANDENONG.RICHMOND,
  ])
  .manual(
    "the-city",
    station.RICHMOND,
    MapSegment.full(
      map.DANDENONG.FLINDERS_STREET_DIRECT,
      map.DANDENONG.RICHMOND,
    ),
  )
  .auto("RICHMOND", "SOUTH_YARRA")
  .auto("SOUTH_YARRA", "CAULFIELD")
  .auto("CAULFIELD", "CLAYTON")
  .auto("CLAYTON", "DANDENONG")
  .auto("DANDENONG", "CRANBOURNE")
  .auto("DANDENONG", "PAKENHAM")
  .auto("PAKENHAM", "EAST_PAKENHAM")
  .build();
