import * as map from "@/server/entry-point/data/map";
import { MappingDataCollection } from "@/server/data/map/mapping-data-collection";

export const mappingData = new MappingDataCollection(Object.values(map));
