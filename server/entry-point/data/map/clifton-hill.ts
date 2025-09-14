import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(
  group.CLIFTON_HILL,
  station,
  map.CLIFTON_HILL,
)
  .add("the-city", station.JOLIMONT, [
    map.CLIFTON_HILL.FLINDERS_STREET_LOOP,
    map.CLIFTON_HILL.SOUTHERN_CROSS,
    map.CLIFTON_HILL.FLAGSTAFF,
    map.CLIFTON_HILL.MELBOURNE_CENTRAL,
    map.CLIFTON_HILL.PARLIAMENT,
    map.CLIFTON_HILL.JOLIMONT,
  ])
  .add("the-city", station.JOLIMONT, [
    map.CLIFTON_HILL.FLINDERS_STREET_DIRECT,
    map.CLIFTON_HILL.JOLIMONT,
  ])
  .auto("JOLIMONT", "CLIFTON_HILL")
  .auto("CLIFTON_HILL", "HURSTBRIDGE")
  .auto("CLIFTON_HILL", "MERNDA")
  .build();
