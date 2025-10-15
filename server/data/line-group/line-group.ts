import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { nonNull, unique } from "@dan-schel/js-utils";

type Branches = readonly (readonly LineGroupNode[])[];
type Overrides = Map<LineGroupNode, readonly number[]>;

export class LineGroup {
  constructor(
    readonly id: number,
    private readonly _branches: Branches,
    private readonly _lineIds: readonly number[],
    private readonly _stationMappingOverrides: Overrides,
  ) {
    LineGroup._ensureTreeStructure(_branches);
    LineGroup._ensureValidOverrides(_branches, _stationMappingOverrides);

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

  private static _ensureValidOverrides(nodes: Branches, overrides: Overrides) {
    const allNodes = unique(nodes.flat());
    const nonNumericNodes = allNodes.filter((x) => typeof x !== "number");

    for (const node of nonNumericNodes) {
      if (!overrides.has(node)) {
        throw new Error(`Node '${node}' requires a station mapping override`);
      }
    }

    for (const node of overrides.keys()) {
      if (!allNodes.includes(node)) {
        throw new Error(`Override provided for unknown node '${node}'`);
      }
    }
  }

  get lines() {
    return unique(this._lineIds);
  }

  get branches() {
    return this._branches.map((b, i) => ({
      branchIndex: i,
      lineId: this._lineIds[i],
      nodes: b,
    }));
  }

  get root() {
    return this._branches[0][0];
  }

  getChildNodes(node: LineGroupNode): LineGroupNode[] {
    const index = this.getIndexOfNode(node);
    const branches = this.getBranchesWithNode(node);
    return unique(branches.map((b) => b.nodes[index + 1]).filter(nonNull));
  }

  getBranchesForLine(lineId: number) {
    const result = this.branches.find((b) => b.lineId === lineId);
    if (!result) throw new Error("Line not part of this group.");
    return result;
  }

  getBranchesWithNode(node: LineGroupNode) {
    return this.branches.filter((b) => b.nodes.includes(node));
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
    if (overrides) return [...overrides];

    if (typeof node === "number") {
      return [node];
    }

    throw new Error(`No station mapping for node '${node}'`);
  }

  hasNode(node: LineGroupNode) {
    return this._branches.some((b) => b.includes(node));
  }

  /**
   * The index where this node appears on any branches. (It's impossible for a
   * node to exist at different indices on different branches.)
   */
  getIndexOfNode(node: LineGroupNode) {
    const index = this._branches.find((b) => b.includes(node))?.indexOf(node);
    if (index == null) throw new Error(`Node "${node}" not in this group.`);
    return index;
  }

  isOnSameBranch(a: LineGroupNode, b: LineGroupNode) {
    const aBranches = this.getBranchesWithNode(a).map((x) => x.branchIndex);
    const bBranches = this.getBranchesWithNode(b).map((x) => x.branchIndex);
    return !new Set(aBranches).isDisjointFrom(new Set(bBranches));
  }
}
