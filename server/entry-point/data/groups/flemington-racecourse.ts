import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(stations.FLINDERS_STREET)
  .add(stations.SOUTHERN_CROSS)
  .add(stations.NORTH_MELBOURNE)
  .add(stations.SHOWGROUNDS)
  .add(stations.FLEMINGTON_RACECOURSE)
  .terminate(lines.FLEMINGTON_RACECOURSE)
  .build();
