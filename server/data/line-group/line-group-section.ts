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

  getReasonIsInvalid(_group: LineGroup): string | null {
    // Valid if:
    // - All nodes are valid for the group
    // - All end nodes are further down the tree than the start node
    // - No end nodes can be upstream on the same branch as another end node

    return null;
  }

  toLineGroupEdges(group: LineGroup): LineGroupEdge[] {
    if (!this.isValid(group)) throw new Error("Invalid section");

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
    return new LineGroupSection(group.id, 1, []);
  }
}
