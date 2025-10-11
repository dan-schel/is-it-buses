import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import {
  LineGroupNode,
  lineGroupNodeJson,
} from "@/server/data/line-group/line-group-node";
import { areUnique, unique } from "@dan-schel/js-utils";
import z from "zod";

export class LineGroupSection {
  constructor(
    readonly groupId: number,
    readonly startNodeId: LineGroupNode,
    readonly endNodeIds: LineGroupNode[],
  ) {
    if (endNodeIds.length === 0) throw new Error(`Cannot have zero end nodes.`);
    if (!areUnique(endNodeIds)) throw new Error(`End nodes must be unique.`);

    if (endNodeIds.includes(startNodeId)) {
      throw new Error(`Cannot have the same start and end node.`);
    }
  }

  static readonly json = z.object({
    groupId: z.number(),
    startNodeId: lineGroupNodeJson,
    endNodeIds: lineGroupNodeJson.array(),
  });

  toJson(): z.input<typeof LineGroupSection.json> {
    return {
      groupId: this.groupId,
      startNodeId: this.startNodeId,
      endNodeIds: this.endNodeIds,
    };
  }

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

      // All end nodes must occurs after the start node.
      if (endNodeIndex < startNodeIndex) {
        return `Invalid end node "${endNode}" as it occurs before start node "${this.startNodeId}".`;
      }

      for (let j = 0; j < this.endNodeIds.length; j++) {
        if (i === j) continue;

        const otherNode = this.endNodeIds[j];
        const otherNodeIndex = group.requireIndexOfNode(otherNode);

        // End nodes cannot be on the same branch as each other.
        if (group.isOnSameBranch(endNode, otherNode)) {
          const first = endNodeIndex < otherNodeIndex ? endNode : otherNode;
          const second = endNodeIndex < otherNodeIndex ? otherNode : endNode;
          return `Node "${second}" cannot be an end node as upstream node "${first}" already is.`;
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
   * converts it to a valid line group section. More lenient than the
   * constructor in that intermediate nodes (e.g. Westall, if given "Caulfield,
   * Westall, and Dandenong") and duplicated nodes are ignored. Throws if fewer
   * than two nodes are given, or if any nodes are invalid for the given group.
   */
  static fromExtremities(
    group: LineGroup,
    nodes: LineGroupNode[],
  ): LineGroupSection {
    const uniqueNodes = unique(nodes);
    for (const node of uniqueNodes) {
      if (!group.hasNode(node)) throw new Error(`Unknown node "${node}".`);
    }

    const startNode = uniqueNodes.reduce((acc, x) => {
      if (acc == null) return x;
      const xIndex = group.requireIndexOfNode(x);
      const accIndex = group.requireIndexOfNode(acc);
      return xIndex < accIndex ? x : acc;
    });

    const remainingNodes = uniqueNodes.filter((x) => x !== startNode);
    if (remainingNodes.length === 0) throw new Error(``);

    const endNodes = remainingNodes.filter((a, i) => {
      return remainingNodes.every((b, j) => {
        if (i === j) return true;
        if (!group.isOnSameBranch(a, b)) return true;

        // If we've found two end nodes on the same branch, only keep the one
        // which appears further down the tree.
        return group.requireIndexOfNode(a) > group.requireIndexOfNode(b);
      });
    });

    return new LineGroupSection(group.id, startNode, endNodes);
  }
}
