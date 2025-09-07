import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { MapSegment } from "@/server/data/map-segment";
import { MappingData } from "@/server/data/map/mapping-data";

export class MappingDataBuilder {
  // TODO: LineShapeEdge literally meaning a pair of line shape nodes, not the
  // current LineShapeEdge class (which this work aims to deprecate).
  // Come to think of it, this is the exact same data the MappingData class
  // itself will have, do we even need this builder class? Will the constructor
  // of MappingData do some validation to ensure all edges of the line group are
  // covered or something?
  private readonly _data: { edge: LineGroupEdge; segments: MapSegment[] }[] =
    [];

  constructor(readonly lineGroup: LineGroup) {}

  add(a: LineGroupNode, b: LineGroupNode, mapNodeIds: number[]) {
    if (mapNodeIds.length < 2 || a === b) throw new Error("Invalid arguments.");

    const edges = this.lineGroup.getEdgesBetween(a, b);

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
      throw new Error("Bad number of edges or map nodes.");
    }

    return this;
  }

  build() {
    // TODO: Create it.
    return new MappingData();
  }
}
