import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";

export class LineGroupSection {
  constructor(
    readonly groupId: number,
    readonly startNodeId: LineGroupNode,
    readonly endNodeIds: LineGroupNode[],
  ) {}

  isValid(group: LineGroup): boolean {
    return this.getReasonIsInvalid(group) == null;
  }

  getReasonIsInvalid(group: LineGroup): string | null {
    // All nodes must exist in the group.
    for (const node of [this.startNodeId, ...this.endNodeIds]) {
      if (!group.hasNode(node)) {
        return `Node "${node}" not valid for the given group.`;
      }
    }

    const startNodeIndex = group.requireIndexOfNode(this.startNodeId);
    for (let i = 0; i < this.endNodeIds.length; i++) {
      const endNode = this.endNodeIds[i];
      const endNodeIndex = group.requireIndexOfNode(endNode);

      // All end nodes must occurs after the start node, and cannot equal it.
      if (endNode === this.startNodeId) {
        return `Start node "${endNode}" cannot also be an end node.`;
      }
      if (endNodeIndex < startNodeIndex) {
        return `Invalid end node "${endNode}" as it occurs before start node "${this.startNodeId}".`;
      }

      for (let j = 0; j < this.endNodeIds.length; j++) {
        if (i === j) continue;

        const nodeA = endNode;
        const nodeAIndex = endNodeIndex;
        const nodeABranches = new Set(group.getBranchIndicesWithNode(nodeA));

        const nodeB = this.endNodeIds[j];
        const nodeBIndex = group.requireIndexOfNode(nodeB);
        const nodeBBranches = new Set(group.getBranchIndicesWithNode(nodeB));

        // End nodes cannot be on the same branch as each other, or duplicated.
        if (nodeA === nodeB) {
          return `End node "${endNode}" given twice.`;
        }
        if (!nodeABranches.isDisjointFrom(nodeBBranches)) {
          const upstreamNode = nodeAIndex < nodeBIndex ? nodeA : nodeB;
          const downstreamNode = nodeAIndex < nodeBIndex ? nodeB : nodeA;
          return `Node "${downstreamNode}" cannot be an end node as upstream node "${upstreamNode}" already is.`;
        }
      }
    }

    return null;
  }

  toLineGroupEdges(group: LineGroup): LineGroupEdge[] {
    if (!this.isValid(group)) throw new Error("Invalid section");

    // TODO: [DS] Implement it.
    return [];
  }

  /**
   * Takes a list of extremities, e.g. "Westall, Pakenham and Cranbourne", and
   * converts it to a valid line group section. Throws if fewer than two nodes
   * are given, or if any nodes are invalid for the given group. More lenient
   * than the constructor in that intermediate nodes are ignored (e.g. if given
   * "Caulfield, Westall, and Dandenong", Westall will be ignored).
   */
  static fromExtremities(
    group: LineGroup,
    _nodes: LineGroupNode[],
  ): LineGroupSection {
    // TODO: [DS] Implement it.
    return new LineGroupSection(group.id, 1, []);
  }
}
