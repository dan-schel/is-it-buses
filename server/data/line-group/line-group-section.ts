import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import {
  LineGroupNode,
  lineGroupNodeJson,
} from "@/server/data/line-group/line-group-node";
import { areUnique, arraysMatch, unique } from "@dan-schel/js-utils";
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

  static readonly bson = z
    .object({
      groupId: z.number(),
      startNodeId: lineGroupNodeJson,
      endNodeIds: lineGroupNodeJson.array(),
    })
    .transform(
      (x) => new LineGroupSection(x.groupId, x.startNodeId, x.endNodeIds),
    );

  toBson(): z.input<typeof LineGroupSection.bson> {
    return {
      groupId: this.groupId,
      startNodeId: this.startNodeId,
      endNodeIds: this.endNodeIds,
    };
  }

  equals(other: LineGroupSection) {
    return (
      this.groupId === other.groupId &&
      this.startNodeId === other.startNodeId &&
      arraysMatch(this.endNodeIds, other.endNodeIds)
    );
  }

  isValid(group: LineGroup): boolean {
    return this.getReasonIsInvalid(group) == null;
  }

  getReasonIsInvalid(group: LineGroup): string | null {
    if (group.id !== this.groupId) throw new Error(`Wrong group given.`);

    // All nodes must exist in the group.
    for (const node of [this.startNodeId, ...this.endNodeIds]) {
      if (!group.hasNode(node)) {
        return `Node "${node}" not valid for the given group.`;
      }
    }

    const startNodeIndex = group.getIndexOfNode(this.startNodeId);
    for (let i = 0; i < this.endNodeIds.length; i++) {
      const endNode = this.endNodeIds[i];
      const endNodeIndex = group.getIndexOfNode(endNode);

      // All end nodes must occurs after the start node.
      if (endNodeIndex < startNodeIndex) {
        return `Invalid end node "${endNode}" as it occurs before start node "${this.startNodeId}".`;
      }

      for (let j = 0; j < this.endNodeIds.length; j++) {
        if (i === j) continue;

        const otherNode = this.endNodeIds[j];
        const otherNodeIndex = group.getIndexOfNode(otherNode);

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

    const totalEdges = this.endNodeIds.flatMap((x) =>
      group.getEdgesBetween(this.startNodeId, x),
    );

    return unique(totalEdges, (a, b) => a.isSameEdge(b));
  }

  getImpactedLines(group: LineGroup): readonly number[] {
    if (!this.isValid(group)) throw new Error("Invalid section");

    const startNodeIndex = group.getIndexOfNode(this.startNodeId);

    // Look for branches which have both the start and one of the end nodes, and
    // take note of the node which directly follows the start node. Any branch
    // which contains one of these nodes will be impacted.
    const impactedAncestorNodes = group
      .getBranchesWithNode(this.startNodeId)
      .filter((b) => this.endNodeIds.some((n) => b.nodes.includes(n)))
      .map((b) => b.nodes[startNodeIndex + 1]);

    const impactedBranches = group.branches.filter((b) =>
      impactedAncestorNodes.some((n) => b.nodes.includes(n)),
    );

    return unique(impactedBranches.map((b) => b.lineId));
  }

  /**
   * Node which are the final node impacted by this section in branches which do
   * not contain an end node, e.g. if the section is "Caulfield to East
   * Pakenham", Dandenong is an indirect end node (because it's the junction for
   * the Cranbourne line).
   */
  getIndirectEndNodes(group: LineGroup): LineGroupNode[] {
    if (!this.isValid(group)) throw new Error("Invalid section");

    const impactedBranches = group.getBranchesWithNode(this.startNodeId);
    const directlyImpactedBranches = impactedBranches.filter((b) =>
      this.endNodeIds.some((n) => b.nodes.includes(n)),
    );
    const indirectlyImpactedBranches = impactedBranches.filter((b) =>
      this.endNodeIds.every((n) => !b.nodes.includes(n)),
    );

    const result: LineGroupNode[] = [];

    for (const branch of indirectlyImpactedBranches) {
      const lastCommonNode = branch.nodes.findLast((n) =>
        directlyImpactedBranches.some((b) => b.nodes.includes(n)),
      );

      if (lastCommonNode != null && lastCommonNode !== this.startNodeId) {
        result.push(lastCommonNode);
      }
    }

    return unique(result);
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
      const xIndex = group.getIndexOfNode(x);
      const accIndex = group.getIndexOfNode(acc);
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
        return group.getIndexOfNode(a) > group.getIndexOfNode(b);
      });
    });

    return new LineGroupSection(group.id, startNode, endNodes);
  }
}
