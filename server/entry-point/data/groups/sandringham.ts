import * as groupId from "@/shared/group-ids";
import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder(groupId.SANDRINGHAM)
  .add(station.FLINDERS_STREET)
  .add(station.RICHMOND)
  .add(station.SOUTH_YARRA)
  .add(station.PRAHRAN)
  .add(station.WINDSOR)
  .add(station.BALACLAVA)
  .add(station.RIPPONLEA)
  .add(station.ELSTERNWICK)
  .add(station.GARDENVALE)
  .add(station.NORTH_BRIGHTON)
  .add(station.MIDDLE_BRIGHTON)
  .add(station.BRIGHTON_BEACH)
  .add(station.HAMPTON)
  .add(station.SANDRINGHAM)
  .terminate(line.SANDRINGHAM)
  .build([]);
