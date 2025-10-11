import * as groupId from "@/shared/group-ids";
import * as station from "@/shared/station-ids";
import * as line from "@/shared/line-ids";
import { LineGroupBuilder } from "@/server/data/line-group/line-group-builder";
import {
  cityLoopOverride,
  metroTunnelStations,
} from "@/server/entry-point/data/station-mapping-overrides";
import { config } from "@/server/entry-point/config";

export const sunburyIsSeparateGroup = config.METRO_TUNNEL_STATE !== "not-open";

const hybrid = sunburyIsSeparateGroup
  ? new LineGroupBuilder(groupId.SUNBURY)
      .add("the-city")
      .do(addFootscrayToSunbury)
      .build([
        {
          node: "the-city",
          stations: [
            ...cityLoopOverride.stations,
            ...metroTunnelStations,
            station.NORTH_MELBOURNE,
          ],
        },
      ])
  : null;

const withoutCityLoop = sunburyIsSeparateGroup
  ? new LineGroupBuilder(groupId.SUNBURY)
      .add(station.TOWN_HALL)
      .add(station.STATE_LIBRARY)
      .add(station.PARKVILLE)
      .add(station.ARDEN)
      .do(addFootscrayToSunbury)
      .build([])
  : null;

export const group = {
  "not-open": null,
  hybrid: hybrid,
  "fully-open": withoutCityLoop,
}[config.METRO_TUNNEL_STATE];

export function addFootscrayToSunbury(builder: LineGroupBuilder) {
  return builder
    .add(station.FOOTSCRAY)
    .add(station.MIDDLE_FOOTSCRAY)
    .add(station.WEST_FOOTSCRAY)
    .add(station.TOTTENHAM)
    .add(station.SUNSHINE)
    .add(station.ALBION)
    .add(station.GINIFER)
    .add(station.ST_ALBANS)
    .add(station.KEILOR_PLAINS)
    .add(station.WATERGARDENS)
    .add(station.DIGGERS_REST)
    .add(station.SUNBURY)
    .terminate(line.SUNBURY);
}
