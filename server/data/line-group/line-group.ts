import { LineShapeNode } from "@/server/data/line/line-routes/line-shape";
import { nonNull } from "@dan-schel/js-utils";

// We need to map the MapSections onto this concept somehow, so we can remove
// LineRoutes. I actually think it might belong better in a different object
// though, to keep this one simple. We can ensure (at runtime/in a unit test)
// that every edge in this tree has one and only one associated list of map
// sections, housed in some other object. (Surely we can also do something
// neat, like saying "this map section covers from Caulfield to Clayton", and it
// can look at the line group, see there's X number of stations in that section,
// and divide things up, all on it's own. Again - I want to avoid the situation
// where we have to list every station multiple times in config. Let's do it
// once for the LineGroups and never again!)

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

  // TODO: Used when constructing the data the frontend will need to provide an
  // admin editor for LineGroupSections.
  // get root(): LineShapeNode {}
  // get edges(): { from: LineShapeNode, to: LineShapeNode }[] {}
  // getChildNodes(node: LineShapeNode): LineShapeNode[] {}

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
