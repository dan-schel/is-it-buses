import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(station.FLINDERS_STREET)
  .add(station.SOUTHERN_CROSS)
  .add(station.NORTH_MELBOURNE)
  .add(station.SHOWGROUNDS)
  .add(station.FLEMINGTON_RACECOURSE)
  .terminate(line.FLEMINGTON_RACECOURSE)
  .build([]);
