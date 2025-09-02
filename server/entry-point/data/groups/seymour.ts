import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const seymour = new LineGroupBuilder()
  .add(stations.SOUTHERN_CROSS)
  .add(stations.NORTH_MELBOURNE)
  .add(stations.BROADMEADOWS)
  .add(stations.CRAIGIEBURN)
  .add(stations.DONNYBROOK)
  .add(stations.WALLAN)
  .add(stations.HEATHCOTE_JUNCTION)
  .add(stations.WANDONG)
  .add(stations.KILMORE_EAST)
  .add(stations.BROADFORD)
  .add(stations.TALLAROOK)
  .add(stations.SEYMOUR)

  // Albury line
  .split()
  .add(stations.AVENEL)
  .add(stations.EUROA)
  .add(stations.VIOLET_TOWN)
  .add(stations.BENALLA)
  .add(stations.WANGARATTA)
  .add(stations.SPRINGHURST)
  .add(stations.CHILTERN)
  .add(stations.WODONGA)
  .add(stations.ALBURY)
  .terminate(lines.ALBURY)

  // Shepparton line
  .add(stations.NAGAMBIE)
  .add(stations.MURCHISON_EAST)
  .add(stations.MOOROOPNA)
  .add(stations.SHEPPARTON)
  .terminate(lines.SHEPPARTON)

  .build();
