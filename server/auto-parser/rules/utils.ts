import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import {
  FLAGSTAFF,
  FLINDERS_STREET,
  MELBOURNE_CENTRAL,
  PARLIAMENT,
  SOUTHERN_CROSS,
} from "@/shared/station-ids";

const TheCityStations = [
  FLINDERS_STREET,
  SOUTHERN_CROSS,
  FLAGSTAFF,
  MELBOURNE_CENTRAL,
  PARLIAMENT,
];

export function isPartOfTheCity(stationId: number) {
  return TheCityStations.includes(stationId);
}

export function doesLineRunThroughCityLoop(nodes: readonly LineGroupNode[]) {
  return nodes.includes("the-city");
}
