import { LineGroup } from "@/server/data/line-group/line-group";
import { LineGroupEdge } from "@/server/data/line-group/line-group-edge";
import { LineGroupNode } from "@/server/data/line-group/line-group-node";
import { MapSegment } from "@/server/data/map-segment";
import { MappingData } from "@/server/data/map/mapping-data";

export class MappingDataBuilder {
  private readonly _data: { edge: LineGroupEdge; segments: MapSegment[] }[] =
    [];

  constructor(readonly lineGroup: LineGroup) {}

  add(a: LineGroupNode, b: LineGroupNode, mapNodeIds: number[]) {
    if (mapNodeIds.length < 2 || a === b) throw new Error("Invalid arguments.");

    const edges = this.lineGroup.getEdgesBetween(a, b);

    if (edges.length === 1) {
      // TODO: convertChainToSegments to convert [1, 2, 3] to
      // [Segment(1, 2), Segment(2, 3)].
      const segments = MapSegment.chain(mapNodeIds);
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
    return new MappingData(this.lineGroup, this._data);
  }
}
