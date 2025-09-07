import { LineGroupNode } from "@/server/data/line-group/line-group-node";

export class LineGroupEdge {
  constructor(
    public readonly a: LineGroupNode,
    public readonly b: LineGroupNode,
  ) {
    if (a === b) {
      throw new Error("Edge cannot connect a node to itself");
    }
  }

  static chain(nodes: readonly LineGroupNode[]) {
    if (nodes.length < 2) {
      throw new Error("At least two nodes are required to form edges.");
    }

    const edges: LineGroupEdge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push(new LineGroupEdge(nodes[i], nodes[i + 1]));
    }
    return edges;
  }
}
