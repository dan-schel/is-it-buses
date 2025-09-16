import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { nonNull, unique } from "@dan-schel/js-utils";

type Branches = readonly (readonly LineGroupNode[])[];

export class LineGroup {
  constructor(
    private readonly _branches: Branches,
    private readonly _lineIds: readonly number[],
    private readonly _stationMappingOverrides: Map<LineGroupNode, number[]>,
  ) {
    LineGroup._ensureTreeStructure(_branches);
    if (_lineIds.length !== _branches.length) {
      throw new Error("Mismatched number of line IDs and branches");
    }
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

  getBranchesForLine(lineId: number) {
    const result = this.branches.find((b) => b.lineId === lineId);
    if (!result) throw new Error("Line not part of this group.");
    return result;
  }

  getEdgesBetween(a: LineGroupNode, b: LineGroupNode): LineGroupEdge[] {
    const br = this._branches.find((x) => x.includes(a) && x.includes(b));
    if (!br) throw new Error("Invalid nodes (different branches/not found).");

    const i = br.indexOf(a);
    const j = br.indexOf(b);
    if (i === j) return [];

    const nodes = i < j ? br.slice(i, j + 1) : br.slice(j, i + 1).reverse();
    return LineGroupEdge.chain(nodes);
  }

  getEdgesOnLine(lineId: number): LineGroupEdge[] {
    return LineGroupEdge.chain(this.getBranchesForLine(lineId).nodes);
  }

  getNodesOnLine(lineId: number): LineGroupNode[] {
    const branches = this.branches.filter((b) => b.lineId === lineId);
    if (branches.length === 0) throw new Error("Line not part of this group.");

    return unique(branches.flatMap((b) => b.nodes));
  }

  getStationsOnLine(lineId: number): number[] {
    const nodes = this.getNodesOnLine(lineId);
    return nodes.flatMap((n) => this.getStationsForNode(n));
  }

  getStationsForNode(node: LineGroupNode): number[] {
    const overrides = this._stationMappingOverrides.get(node);
    if (overrides) return overrides;

    if (typeof node === "number") {
      return [node];
    }

    throw new Error(`No station mapping for node '${node}'`);
  }
}
