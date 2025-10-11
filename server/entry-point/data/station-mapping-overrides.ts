import { StationMappingOverride } from "@/server/data/line-group/line-group-builder";
import * as station from "@/shared/station-ids";

export const cityLoopOverride: StationMappingOverride = {
  node: "the-city",
  stations: [
    station.FLINDERS_STREET,
    station.SOUTHERN_CROSS,
    station.FLAGSTAFF,
    station.MELBOURNE_CENTRAL,
    station.PARLIAMENT,
  ],
};

export const metroTunnelStations = [
  station.ANZAC,
  station.TOWN_HALL,
  station.STATE_LIBRARY,
  station.PARKVILLE,
  station.ARDEN,
];

// TODO: [DS] This suggests that station overrides should be defined for an EDGE
// not a NODE, since Laverton - Werribee shouldn't include these stations.
export const altonaLoopOverride: StationMappingOverride = {
  node: station.LAVERTON,
  stations: [
    station.SEAHOLME,
    station.ALTONA,
    station.WESTONA,
    station.LAVERTON,
  ],
};
