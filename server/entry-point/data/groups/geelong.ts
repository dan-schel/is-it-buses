import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const geelong = new LineGroupBuilder()
  .add(stations.SOUTHERN_CROSS)
  .add(stations.FOOTSCRAY)
  .add(stations.SUNSHINE)
  .add(stations.DEER_PARK)
  .add(stations.TARNEIT)
  .add(stations.WYNDHAM_VALE)
  .add(stations.LITTLE_RIVER)
  .add(stations.LARA)
  .add(stations.CORIO)
  .add(stations.NORTH_SHORE)
  .add(stations.NORTH_GEELONG)
  .add(stations.GEELONG)
  .add(stations.SOUTH_GEELONG)
  .add(stations.MARSHALL)
  .add(stations.WAURN_PONDS)
  .add(stations.WINCHELSEA)
  .add(stations.BIRREGURRA)
  .add(stations.COLAC)
  .add(stations.CAMPERDOWN)
  .add(stations.TERANG)
  .add(stations.SHERWOOD_PARK)
  .add(stations.WARRNAMBOOL)
  .terminate(lines.GEELONG)
  .build();
