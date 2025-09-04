import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const bendigo = new LineGroupBuilder()
  .add(stations.SOUTHERN_CROSS)
  .add(stations.FOOTSCRAY)
  .add(stations.WATERGARDENS)
  .add(stations.SUNBURY)
  .add(stations.CLARKEFIELD)
  .add(stations.RIDDELLS_CREEK)
  .add(stations.GISBORNE)
  .add(stations.MACEDON)
  .add(stations.WOODEND)
  .add(stations.KYNETON)
  .add(stations.MALMSBURY)
  .add(stations.CASTLEMAINE)
  .add(stations.KANGAROO_FLAT)
  .add(stations.BENDIGO)

  // Echuca branch
  .split()
  .add(stations.EPSOM)
  .add(stations.HUNTLY)
  .add(stations.GOORNONG)
  .add(stations.ELMORE)
  .add(stations.ROCHESTER)
  .add(stations.ECHUCA)
  .terminate(lines.BENDIGO)

  // Swan Hill branch
  .add(stations.EAGLEHAWK)
  .add(stations.RAYWOOD)
  .add(stations.DINGEE)
  .add(stations.PYRAMID)
  .add(stations.KERANG)
  .add(stations.SWAN_HILL)
  .terminate(lines.BENDIGO)

  .build();
