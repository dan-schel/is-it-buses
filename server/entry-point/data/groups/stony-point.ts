import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const stonyPoint = new LineGroupBuilder()
  .add(stations.FRANKSTON)
  .add(stations.LEAWARRA)
  .add(stations.BAXTER)
  .add(stations.SOMERVILLE)
  .add(stations.TYABB)
  .add(stations.HASTINGS)
  .add(stations.BITTERN)
  .add(stations.MORRADOO)
  .add(stations.CRIB_POINT)
  .add(stations.STONY_POINT)
  .terminate(lines.STONY_POINT)
  .build();
