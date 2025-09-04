import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(station.SOUTHERN_CROSS)
  .add(station.FOOTSCRAY)
  .add(station.SUNSHINE)
  .add(station.ARDEER)
  .add(station.DEER_PARK)
  .add(station.CAROLINE_SPRINGS)
  .add(station.ROCKBANK)
  .add(station.COBBLEBANK)
  .add(station.MELTON)
  .add(station.BACCHUS_MARSH)
  .add(station.BALLAN)
  .add(station.BALLARAT)

  // Maryborough branch
  .split()
  .add(station.CRESWICK)
  .add(station.CLUNES)
  .add(station.TALBOT)
  .add(station.MARYBOROUGH)
  .terminate(line.BALLARAT)

  // Ararat branch
  .add(station.WENDOUREE)
  .add(station.BEAUFORT)
  .add(station.ARARAT)
  .terminate(line.BALLARAT)

  .build();
