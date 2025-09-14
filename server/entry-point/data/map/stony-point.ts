import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(group.STONY_POINT)
  .add(station.FRANKSTON, station.STONY_POINT, [
    map.STONY_POINT.FRANKSTON,
    map.STONY_POINT.STONY_POINT,
  ])
  .build();
