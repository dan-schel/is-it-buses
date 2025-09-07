import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(station.FRANKSTON)
  .add(station.LEAWARRA)
  .add(station.BAXTER)
  .add(station.SOMERVILLE)
  .add(station.TYABB)
  .add(station.HASTINGS)
  .add(station.BITTERN)
  .add(station.MORRADOO)
  .add(station.CRIB_POINT)
  .add(station.STONY_POINT)
  .terminate(line.STONY_POINT)
  .build();
