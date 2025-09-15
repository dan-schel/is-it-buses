import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(station.SOUTHERN_CROSS)
  .add(station.FOOTSCRAY)
  .add(station.WATERGARDENS)
  .add(station.SUNBURY)
  .add(station.CLARKEFIELD)
  .add(station.RIDDELLS_CREEK)
  .add(station.GISBORNE)
  .add(station.MACEDON)
  .add(station.WOODEND)
  .add(station.KYNETON)
  .add(station.MALMSBURY)
  .add(station.CASTLEMAINE)
  .add(station.KANGAROO_FLAT)
  .add(station.BENDIGO)

  // Echuca branch
  .split()
  .add(station.EPSOM)
  .add(station.HUNTLY)
  .add(station.GOORNONG)
  .add(station.ELMORE)
  .add(station.ROCHESTER)
  .add(station.ECHUCA)
  .terminate(line.BENDIGO)

  // Swan Hill branch
  .add(station.EAGLEHAWK)
  .add(station.RAYWOOD)
  .add(station.DINGEE)
  .add(station.PYRAMID)
  .add(station.KERANG)
  .add(station.SWAN_HILL)
  .terminate(line.BENDIGO)

  .build([]);
