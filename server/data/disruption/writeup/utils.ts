import { App } from "@/server/app";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { LineSection } from "@/server/data/line-section";
import { listifyAnd, unique } from "@dan-schel/js-utils";

export function formatSections(app: App, sections: LineSection[]): string {
  if (sections.length === 0) {
    throw new Error("Must have at least one section.");
  }

  if (sections.length === 1 || allTheSame(sections)) {
    const a = formatLineGroupNode(app, sections[0].a);
    const b = formatLineGroupNode(app, sections[0].b);
    return `from ${a} to ${b}`;
  }

  const commonNode = getCommonNode(sections);
  if (commonNode != null) {
    const common = formatLineGroupNode(app, commonNode.common);
    const connections = commonNode.connections.map((n) =>
      formatLineGroupNode(app, n),
    );
    return `from ${common} to ${listifyAnd(connections)}`;
  }

  const individualSections = sections.map((s) => {
    const a = formatLineGroupNode(app, s.a);
    const b = formatLineGroupNode(app, s.b);
    return `from ${a} to ${b}`;
  });
  return listifyAnd(individualSections);
}

export function formatLineGroupNode(
  app: App,
  node: LineGroupNode,
  { capitalize = false } = {},
): string {
  if (node === "the-city") return capitalize ? "The city" : "the city";
  return app.stations.get(node)?.name ?? "unknown";
}

function allTheSame(sections: LineSection[]): boolean {
  const first = sections[0];
  return sections.every(
    (s) =>
      (s.a === first.a && s.b === first.b) ||
      (s.a === first.b && s.b === first.a),
  );
}

function getCommonNode(
  sections: LineSection[],
): { common: LineGroupNode; connections: LineGroupNode[] } | null {
  const allNodes = unique(sections.map((s) => [s.a, s.b]).flat());

  const common = allNodes.find((n) =>
    sections.every((s) => s.a === n || s.b === n),
  );
  if (common == null) return null;

  const connections = allNodes.filter((n) => n !== common);
  return { common, connections };
}
