import * as groupId from "@/shared/group-ids";
import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder(groupId.GEELONG)
  .add(station.SOUTHERN_CROSS)
  .add(station.FOOTSCRAY)
  .add(station.SUNSHINE)
  .add(station.DEER_PARK)
  .add(station.TARNEIT)
  .add(station.WYNDHAM_VALE)
  .add(station.LITTLE_RIVER)
  .add(station.LARA)
  .add(station.CORIO)
  .add(station.NORTH_SHORE)
  .add(station.NORTH_GEELONG)
  .add(station.GEELONG)
  .add(station.SOUTH_GEELONG)
  .add(station.MARSHALL)
  .add(station.WAURN_PONDS)
  .add(station.WINCHELSEA)
  .add(station.BIRREGURRA)
  .add(station.COLAC)
  .add(station.CAMPERDOWN)
  .add(station.TERANG)
  .add(station.SHERWOOD_PARK)
  .add(station.WARRNAMBOOL)
  .terminate(line.GEELONG)
  .build([]);
