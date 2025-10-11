import * as groupId from "@/shared/group-ids";
import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";
import { cityLoopOverride } from "@/server/entry-point/data/station-mapping-overrides";

export const group = new LineGroupBuilder(groupId.CLIFTON_HILL)
  .add("the-city")
  .add(station.JOLIMONT)
  .add(station.WEST_RICHMOND)
  .add(station.NORTH_RICHMOND)
  .add(station.COLLINGWOOD)
  .add(station.VICTORIA_PARK)
  .add(station.CLIFTON_HILL)

  // Hurstbridge line
  .split()
  .add(station.WESTGARTH)
  .add(station.DENNIS)
  .add(station.FAIRFIELD)
  .add(station.ALPHINGTON)
  .add(station.DAREBIN)
  .add(station.IVANHOE)
  .add(station.EAGLEMONT)
  .add(station.HEIDELBERG)
  .add(station.ROSANNA)
  .add(station.MACLEOD)
  .add(station.WATSONIA)
  .add(station.GREENSBOROUGH)
  .add(station.MONTMORENCY)
  .add(station.ELTHAM)
  .add(station.DIAMOND_CREEK)
  .add(station.WATTLE_GLEN)
  .add(station.HURSTBRIDGE)
  .terminate(line.HURSTBRIDGE)

  // Mernda line
  .add(station.RUSHALL)
  .add(station.MERRI)
  .add(station.NORTHCOTE)
  .add(station.CROXTON)
  .add(station.THORNBURY)
  .add(station.BELL)
  .add(station.PRESTON)
  .add(station.REGENT)
  .add(station.RESERVOIR)
  .add(station.RUTHVEN)
  .add(station.KEON_PARK)
  .add(station.THOMASTOWN)
  .add(station.LALOR)
  .add(station.EPPING)
  .add(station.SOUTH_MORANG)
  .add(station.MIDDLE_GORGE)
  .add(station.HAWKSTOWE)
  .add(station.MERNDA)
  .terminate(line.MERNDA)

  .build([cityLoopOverride]);
