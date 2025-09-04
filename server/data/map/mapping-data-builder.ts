import { LineGroup } from "@/server/data/line-group/line-group";
import { LineShapeNode } from "@/server/data/line/line-routes/line-shape";
import { MapSegment } from "@/server/data/map-segment";
import { MappingData } from "@/server/data/map/mapping-data";

export class MappingDataBuilder {
  // TODO: LineShapeEdge literally meaning a pair of line shape nodes, not the
  // current LineShapeEdge class (which this work aims to deprecate).
  // Come to think of it, this is the exact same data the MappingData class
  // itself will have, do we even need this builder class? Will the constructor
  // of MappingData do some validation to ensure all edges of the line group are
  // covered or something?
  private readonly _data: { edge: LineShapeEdge; segments: MapSegment[] }[] =
    [];

  constructor(readonly lineGroup: LineGroup) {}

  add(a: LineShapeNode, b: LineShapeNode, mapNodeIds: number[]) {
    if (mapNodeIds.length < 2) {
      throw new Error("Requires at least two map node IDs to form a segment.");
    }

    // TODO: This should throw if the nodes are bad (e.g. on different branches, not found, or identical).
    const edges = this.lineGroup.getEdgesBetween(a, b);

    // TODO: Validate that the string of map nodes are adjacent in the map data.
    // (Although we probably can't actually, since it's in the .json file the
    // frontend has, right?)

    if (edges.length === 1) {
      // TODO: Add a mapping entry for the edge, containing each map segment.
    } else if (mapNodeIds.length === 2) {
      // TODO: Create the map segment, and then split it percentage-wise across
      // each edge using MapSegment#part(x, y).
    } else {
      throw new Error(
        "Cannot spread multiple map segments over multiple line group edges.",
      );
    }

    return this;
  }

  build() {
    // TODO: Create it.
    return new MappingData();
  }
}
