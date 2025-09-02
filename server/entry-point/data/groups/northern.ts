import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const northern = new LineGroupBuilder()
  .add("the-city")
  .add(stations.NORTH_MELBOURNE)

  // Upfield line
  .split()
  .add(stations.MACAULAY)
  .add(stations.FLEMINGTON_BRIDGE)
  .add(stations.ROYAL_PARK)
  .add(stations.JEWELL)
  .add(stations.BRUNSWICK)
  .add(stations.ANSTEY)
  .add(stations.MORELAND)
  .add(stations.COBURG)
  .add(stations.BATMAN)
  .add(stations.MERLYNSTON)
  .add(stations.FAWKNER)
  .add(stations.GOWRIE)
  .add(stations.UPFIELD)
  .terminate(lines.UPFIELD)

  // Craigieburn line
  .split()
  .add(stations.KENSINGTON)
  .add(stations.NEWMARKET)
  .add(stations.ASCOT_VALE)
  .add(stations.MOONEE_PONDS)
  .add(stations.ESSENDON)
  .add(stations.GLENBERVIE)
  .add(stations.STRATHMORE)
  .add(stations.PASCOE_VALE)
  .add(stations.OAK_PARK)
  .add(stations.GLENROY)
  .add(stations.JACANA)
  .add(stations.BROADMEADOWS)
  .add(stations.COOLAROO)
  .add(stations.ROXBURGH_PARK)
  .add(stations.CRAIGIEBURN)
  .terminate(lines.CRAIGIEBURN)

  // Sunbury line
  .add(stations.FOOTSCRAY)
  .add(stations.MIDDLE_FOOTSCRAY)
  .add(stations.WEST_FOOTSCRAY)
  .add(stations.TOTTENHAM)
  .add(stations.SUNSHINE)
  .add(stations.ALBION)
  .add(stations.GINIFER)
  .add(stations.ST_ALBANS)
  .add(stations.KEILOR_PLAINS)
  .add(stations.WATERGARDENS)
  .add(stations.DIGGERS_REST)
  .add(stations.SUNBURY)
  .terminate(lines.SUNBURY)

  .build();
