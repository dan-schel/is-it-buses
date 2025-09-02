import * as stations from "@/shared/station-ids";
import * as lines from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const newport = new LineGroupBuilder()
  .add(stations.FLINDERS_STREET)
  .add(stations.SOUTHERN_CROSS)
  .add(stations.NORTH_MELBOURNE)
  .add(stations.SOUTH_KENSINGTON)
  .add(stations.FOOTSCRAY)
  .add(stations.SEDDON)
  .add(stations.YARRAVILLE)
  .add(stations.SPOTSWOOD)
  .add(stations.NEWPORT)

  // Williamstown line
  .split()
  .add(stations.NORTH_WILLIAMSTOWN)
  .add(stations.WILLIAMSTOWN_BEACH)
  .add(stations.WILLIAMSTOWN)
  .terminate(lines.WILLIAMSTOWN)

  // Werribee line
  .add(stations.LAVERTON)
  .add(stations.AIRCRAFT)
  .add(stations.WILLIAMS_LANDING)
  .add(stations.HOPPERS_CROSSING)
  .add(stations.WERRIBEE)
  .terminate(lines.WERRIBEE)

  .build();
