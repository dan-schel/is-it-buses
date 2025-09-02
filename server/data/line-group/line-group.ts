import { LineShapeNode } from "@/server/data/line/line-routes/line-shape";
import { nonNull } from "@dan-schel/js-utils";

export class LineGroup {
  constructor(
    private readonly _nodes: readonly (readonly LineShapeNode[])[],
    private readonly _lineIds: readonly number[],
  ) {
    LineGroup._ensureTreeStructure(_nodes);
    if (_lineIds.length !== this._nodes.length) {
      throw new Error("Mismatched number of line IDs and branches");
    }
  }

  private static _ensureTreeStructure(
    nodes: readonly (readonly LineShapeNode[])[],
  ) {
    if (nodes.length === 0) {
      throw new Error("No branches");
    }

    if (nodes.some((x) => x.length === 0)) {
      throw new Error("Empty branch");
    }

    const rootNote = nodes[0][0];
    if (nodes.some((x) => x[0] !== rootNote)) {
      throw new Error("Branches do not share the same root node");
    }

    const longestArrayLength = Math.max(...nodes.map((x) => x.length));
    const seenNodes = new Set<LineShapeNode>();
    for (let i = 0; i < longestArrayLength; i++) {
      const nodesAtIndex = nodes.map((x) => x[i]).filter(nonNull);
      if (nodesAtIndex.some((x) => seenNodes.has(x))) {
        throw new Error(
          "Node appears in multiple branches at different indices",
        );
      }
      nodesAtIndex.forEach((x) => {
        seenNodes.add(x);
      });
    }
  }
}
