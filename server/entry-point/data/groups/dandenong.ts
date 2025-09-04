import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add("the-city")
  .add(stations.RICHMOND)
  .add(stations.SOUTH_YARRA)
  .add(stations.CAULFIELD)
  .add(stations.CARNEGIE)
  .add(stations.MURRUMBEENA)
  .add(stations.HUGHESDALE)
  .add(stations.OAKLEIGH)
  .add(stations.HUNTINGDALE)
  .add(stations.CLAYTON)
  .add(stations.WESTALL)
  .add(stations.SPRINGVALE)
  .add(stations.SANDOWN_PARK)
  .add(stations.NOBLE_PARK)
  .add(stations.YARRAMAN)
  .add(stations.DANDENONG)

  // Cranbourne line
  .split()
  .add(stations.LYNBROOK)
  .add(stations.MERINDA_PARK)
  .add(stations.CRANBOURNE)
  .terminate(lines.CRANBOURNE)

  // Pakenham line
  .add(stations.HALLAM)
  .add(stations.NARRE_WARREN)
  .add(stations.BERWICK)
  .add(stations.BEACONSFIELD)
  .add(stations.OFFICER)
  .add(stations.CARDINIA_ROAD)
  .add(stations.PAKENHAM)
  .add(stations.EAST_PAKENHAM)
  .terminate(lines.PAKENHAM)

  .build();
