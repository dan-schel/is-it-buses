import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";

export const group = new LineGroupBuilder()
  .add(station.FLINDERS_STREET)
  .add(station.SOUTHERN_CROSS)
  .add(station.NORTH_MELBOURNE)
  .add(station.SOUTH_KENSINGTON)
  .add(station.FOOTSCRAY)
  .add(station.SEDDON)
  .add(station.YARRAVILLE)
  .add(station.SPOTSWOOD)
  .add(station.NEWPORT)

  // Williamstown line
  .split()
  .add(station.NORTH_WILLIAMSTOWN)
  .add(station.WILLIAMSTOWN_BEACH)
  .add(station.WILLIAMSTOWN)
  .terminate(line.WILLIAMSTOWN)

  // Werribee line
  .add(station.LAVERTON)
  .add(station.AIRCRAFT)
  .add(station.WILLIAMS_LANDING)
  .add(station.HOPPERS_CROSSING)
  .add(station.WERRIBEE)
  .terminate(line.WERRIBEE)

  .build();
