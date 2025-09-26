import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(station.SOUTHERN_CROSS)
  .add(station.NORTH_MELBOURNE)
  .add(station.BROADMEADOWS)
  .add(station.CRAIGIEBURN)
  .add(station.DONNYBROOK)
  .add(station.WALLAN)
  .add(station.HEATHCOTE_JUNCTION)
  .add(station.WANDONG)
  .add(station.KILMORE_EAST)
  .add(station.BROADFORD)
  .add(station.TALLAROOK)
  .add(station.SEYMOUR)

  // Albury branch
  .split()
  .add(station.AVENEL)
  .add(station.EUROA)
  .add(station.VIOLET_TOWN)
  .add(station.BENALLA)
  .add(station.WANGARATTA)
  .add(station.SPRINGHURST)
  .add(station.CHILTERN)
  .add(station.WODONGA)
  .add(station.ALBURY)
  .terminate(line.SEYMOUR)

  // Shepparton branch
  .add(station.NAGAMBIE)
  .add(station.MURCHISON_EAST)
  .add(station.MOOROOPNA)
  .add(station.SHEPPARTON)
  .terminate(line.SEYMOUR)

  .build([]);
