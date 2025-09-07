import { assert, describe, expect, it } from "vitest";
import * as group from "@/server/entry-point/data/groups";
import * as station from "@/shared/station-ids";
import { LineGroup } from "@/server/data/line-group/line-group";
import { stations } from "@/server/entry-point/data/stations";
import { lines } from "@/server/entry-point/data/lines";
import { listifyAnd } from "@dan-schel/js-utils";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";

const groups = Object.values(group);

describe("Melbourne line groups", () => {
  it("matches the snapshot", () => {
    const formattedGroups = groups.map(formatGroup);
    const output = `\n\n${formattedGroups.join("\n\n")}\n\n`;
    expect(output).toMatchSnapshot();
  });

  it("includes every station", () => {
    const exceptions = [
      // City loop stations are condensed into a single "the-city" node.
      station.FLAGSTAFF,
      station.MELBOURNE_CENTRAL,
      station.PARLIAMENT,

      // The split in the map on the Werribee line is condensed into a single
      // logical edge.
      station.SEAHOLME,
      station.ALTONA,
      station.WESTONA,
    ];

    const nodes = groups.flatMap((g) => g.branches.map((b) => b.nodes)).flat();

    const missing = stations
      .filter((s) => !nodes.includes(s.id))
      .filter((s) => !exceptions.includes(s.id))
      .map((s) => s.name);

    assert(
      missing.length === 0,
      `Stations not on any line group: ${missing.join(", ")}`,
    );
  });
});

function formatGroup(group: LineGroup) {
  const name = formatLines(group.lines);
  const branches = group.branches.map((x) => {
    const line = formatLine(x.lineId);
    const nodes = x.nodes.map(formatNode).join(" → ");
    return `[${line}] ${nodes}`;
  });
  return `${name}\n${branches.map((x) => `  ${x}`).join("\n")}`;
}

function formatNode(boundary: LineGroupNode) {
  if (boundary === "the-city") {
    return '"The city"';
  } else {
    return stations.require(boundary).name;
  }
}

function formatLines(lineIds: readonly number[]) {
  const suffix = lineIds.length === 1 ? " Line" : " lines";
  return listifyAnd(lineIds.map((x) => formatLine(x))) + suffix;
}

function formatLine(lineId: number) {
  return lines.require(lineId).name;
}
