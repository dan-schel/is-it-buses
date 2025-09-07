import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { nonNull, unique } from "@dan-schel/js-utils";

type Branches = readonly (readonly LineGroupNode[])[];

export class LineGroup {
  constructor(
    private readonly _branches: Branches,
    private readonly _lineIds: readonly number[],
  ) {
    LineGroup._ensureTreeStructure(_branches);
    if (_lineIds.length !== _branches.length) {
      throw new Error("Mismatched number of line IDs and branches");
    }
  }

  get lines() {
    return unique(this._lineIds);
  }

  get branches() {
    return this._branches.map((b, i) => ({
      lineId: this._lineIds[i],
      nodes: b,
    }));
  }

  get root() {
    return this._branches[0][0];
  }

  // TODO: Return all unique edges.
  // get edges() {}

  // getChildNodes(node: LineGroupNode): LineGroupNode[] {}

  getEdgesBetween(a: LineGroupNode, b: LineGroupNode): LineGroupEdge[] {
    const br = this._branches.find((x) => x.includes(a) && x.includes(b));
    if (!br) throw new Error("Invalid nodes (different branches/not found).");

    const i = br.indexOf(a);
    const j = br.indexOf(b);
    if (i === j) return [];

    const nodes = i < j ? br.slice(i, j + 1) : br.slice(j, i + 1).reverse();
    return LineGroupEdge.toEdges(nodes);
  }

  private static _ensureTreeStructure(nodes: Branches) {
    if (nodes.length === 0) throw new Error("No branches.");
    if (nodes.some((x) => x.length === 0)) throw new Error("Empty branch.");

    const root = nodes[0][0];
    if (nodes.some((x) => x[0] !== root)) throw new Error("Multiple roots.");

    const longestArrayLength = Math.max(...nodes.map((x) => x.length));
    const seenNodes = new Set<LineGroupNode>();

    for (let i = 0; i < longestArrayLength; i++) {
      const nodesAtIndex = nodes.map((x) => x[i]).filter(nonNull);

      const alreadySeen = nodesAtIndex.some((x) => seenNodes.has(x));
      if (alreadySeen) throw new Error("Node seen before at different index.");

      nodesAtIndex.forEach((x) => seenNodes.add(x));
    }
  }
}
