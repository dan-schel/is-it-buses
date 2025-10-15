import { App } from "@/server/app";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { LineGroupSection } from "@/server/data/line-group/line-group-section";
import { listifyAnd } from "@dan-schel/js-utils";

export function formatSection(app: App, section: LineGroupSection): string {
  const group = app.lineGroups.require(section.groupId);

  const allEndNodes = [
    ...section.getIndirectEndNodes(group),
    ...section.endNodeIds,
  ].sort((a, b) => group.getIndexOfNode(a) - group.getIndexOfNode(b));

  const formattedStartNode = formatLineGroupNode(app, section.startNodeId);
  const formattedEndNodes = allEndNodes.map((n) => formatLineGroupNode(app, n));

  return `from ${formattedStartNode} to ${listifyAnd(formattedEndNodes)}`;
}

function formatLineGroupNode(
  app: App,
  node: LineGroupNode,
  { capitalize = false } = {},
): string {
  if (node === "the-city") return capitalize ? "The city" : "the city";
  return app.stations.get(node)?.name ?? "unknown";
}
