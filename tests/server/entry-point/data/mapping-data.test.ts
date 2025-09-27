import { describe, expect, it } from "vitest";
import * as map from "@/server/entry-point/data/map";
import * as mapIds from "@/shared/map-node-ids";
import { MappingData } from "@/server/data/map/mapping-data";
import { MapSegment } from "@/server/data/map/map-segment";
import {
  formatLine,
  formatLines,
  formatNode,
} from "@/tests/server/entry-point/data/utils";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";

const maps = Object.values(map);

describe("Melbourne mapping data", () => {
  it("matches the snapshot", () => {
    const formattedGroups = maps.map(formatGroup);
    const output = `\n\n${formattedGroups.join("\n\n")}\n\n`;
    expect(output).toMatchSnapshot();
  });
});

function formatGroup(data: MappingData) {
  const group = data.lineGroup;
  const groupName = formatLines(group.lines);
  const branches = group.branches.map((x) => {
    const line = formatLine(x.lineId);
    const branch = formatBranch(data, x.lineId);
    return `[${line}]\n${branch}`;
  });
  return `${groupName}\n${branches.map((x) => x).join("\n\n")}`;
}

function formatBranch(data: MappingData, lineId: number) {
  const edges = data.lineGroup.getEdgesOnLine(lineId);
  return edges
    .map((x) => {
      const edge = formatEdge(x);
      const segments = data
        .getMapSegmentsForEdge(x)
        .map((y) => `  - ${formatMapSegment(y)}`)
        .join("\n");
      return `  ${edge}\n${segments}`;
    })
    .join("\n");
}

function formatEdge(edge: LineGroupEdge) {
  const a = formatNode(edge.a);
  const b = formatNode(edge.b);
  return `${a} → ${b}`;
}

function formatMapSegment(edge: MapSegment) {
  const a = formatMapNode(edge.mapNodeA);
  const b = formatMapNode(edge.mapNodeB);
  const min = edge.percentage.min.toFixed(2);
  const max = edge.percentage.max.toFixed(2);
  return `${a} → ${b} (${min} → ${max})`;
}

function formatMapNode(searchNodeId: number): string {
  for (const [group, groupNodes] of Object.entries(mapIds)) {
    for (const [node, nodeId] of Object.entries(groupNodes)) {
      if (nodeId === searchNodeId) {
        return `${group}.${node}`;
      }
    }
  }
  throw new Error(`Unknown node "${searchNodeId}"`);
}
