import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import * as map from "@/shared/map-node-ids";
import { MappingDataBuilder } from "@/server/data/map/mapping-data-builder";

export const mappingData = new MappingDataBuilder(
  group.FRANKSTON,
  station,
  map.FRANKSTON,
)
  .auto("FLINDERS_STREET", "RICHMOND")
  .auto("RICHMOND", "SOUTH_YARRA")
  .auto("SOUTH_YARRA", "CAULFIELD")
  .auto("CAULFIELD", "FRANKSTON")
  .build();
