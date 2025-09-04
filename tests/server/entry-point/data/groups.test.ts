// TODO: Test that every LineGroup object's constructor ran successfully. Test
// that every station appears at least once in a line group (except for known
// exceptions: the city loop stations & altona loop stations). Write a snapshot
// test for easy validation?

import { describe, expect, it } from "vitest";
import * as groups from "@/server/entry-point/data/groups";
import { LineShapeNode } from "@/server/data/line/line-routes/line-shape";
import { LineGroup } from "@/server/data/line-group/line-group";
import { stations } from "@/server/entry-point/data/stations";
import { lines } from "@/server/entry-point/data/lines";
import { listifyAnd } from "@dan-schel/js-utils";

describe("Melbourne line groups", () => {
  it("matches the snapshot", () => {
    const formattedGroups = Object.values(groups).map(formatGroup);
    const output = `\n\n${formattedGroups.join("\n\n")}\n\n`;
    expect(output).toMatchSnapshot();
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

function formatNode(boundary: LineShapeNode) {
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
