import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { lines } from "@/server/entry-point/data/lines";
import { stations } from "@/server/entry-point/data/stations";
import { listifyAnd } from "@dan-schel/js-utils";

export function formatLines(lineIds: readonly number[]) {
  const suffix = lineIds.length === 1 ? " Line" : " lines";
  return listifyAnd(lineIds.map((x) => formatLine(x))) + suffix;
}

export function formatLine(lineId: number) {
  return lines.require(lineId).name;
}

export function formatNode(boundary: LineGroupNode) {
  if (boundary === "the-city") {
    return '"The city"';
  } else {
    return stations.require(boundary).name;
  }
}
