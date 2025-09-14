import { describe } from "vitest";
import { LineGroup } from "@/server/data/line-group/line-group";

describe("MappingDataBuilder", () => {
  const STATION_IDS = {
    STATION_1: 1,
    STATION_2: 2,
    STATION_3: 3,
  } as const;

  const MAP_NODE_IDS = {
    STATION_1: 10,
    STATION_2: 20,
    STATION_3: 30,
  } as const;

  const LINE_GROUP = new LineGroup([[1, 2, 3]], [100]);
});
