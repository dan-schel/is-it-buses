import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(
  group.STONY_POINT,
  station,
  map.STONY_POINT,
)
  .auto("FRANKSTON", "STONY_POINT")
  .build();
