import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const ballarat = new LineGroupBuilder()
  .add(stations.SOUTHERN_CROSS)
  .add(stations.FOOTSCRAY)
  .add(stations.SUNSHINE)
  .add(stations.ARDEER)
  .add(stations.DEER_PARK)
  .add(stations.CAROLINE_SPRINGS)
  .add(stations.ROCKBANK)
  .add(stations.COBBLEBANK)
  .add(stations.MELTON)
  .add(stations.BACCHUS_MARSH)
  .add(stations.BALLAN)
  .add(stations.BALLARAT)

  // Maryborough branch
  .split()
  .add(stations.CRESWICK)
  .add(stations.CLUNES)
  .add(stations.TALBOT)
  .add(stations.MARYBOROUGH)
  .terminate(lines.BALLARAT)

  // Ararat branch
  .add(stations.WENDOUREE)
  .add(stations.BEAUFORT)
  .add(stations.ARARAT)
  .terminate(lines.BALLARAT)

  .build();
