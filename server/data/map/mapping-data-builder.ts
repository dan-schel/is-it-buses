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
      // TODO: convertChainToSegments to convert [1, 2, 3] to
      // [Segment(1, 2), Segment(2, 3)].
      const segments = convertChainToSegments(mapNodeIds);
      this._data.push({ edge: edges[0], segments });
    } else if (mapNodeIds.length === 2) {
      const segment = MapSegment.full(mapNodeIds[0], mapNodeIds[1]);
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        this._data.push({
          edge,
          segments: [segment.part(i + 1, edges.length)],
        });
      }
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
