import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(stations.FLINDERS_STREET)
  .add(stations.RICHMOND)
  .add(stations.SOUTH_YARRA)
  .add(stations.PRAHRAN)
  .add(stations.WINDSOR)
  .add(stations.BALACLAVA)
  .add(stations.RIPPONLEA)
  .add(stations.ELSTERNWICK)
  .add(stations.GARDENVALE)
  .add(stations.NORTH_BRIGHTON)
  .add(stations.MIDDLE_BRIGHTON)
  .add(stations.BRIGHTON_BEACH)
  .add(stations.HAMPTON)
  .add(stations.SANDRINGHAM)
  .terminate(lines.SANDRINGHAM)
  .build();
